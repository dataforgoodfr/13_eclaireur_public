import logging
import tempfile
import time
import urllib.request
import zipfile
from pathlib import Path

import polars as pl
from polars import col

from back.scripts.datasets.utils import BaseDataset
from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)

# Source : http://freturb.laet.science/tables/Sirextra.htm
EFFECTIF_CODE_TO_EMPLOYEES = {
    "00": 0,
    "01": 1,
    "02": 3,
    "03": 6,
    "11": 10,
    "12": 20,
    "21": 50,
    "22": 100,
    "31": 200,
    "41": 500,
    "42": 1000,
    "51": 2000,
    "52": 5000,
}

# Rate limiting configuration
RATE_LIMIT_DELAY = 1.5  # seconds between requests
MAX_RETRIES = 3  # number of retries for failed downloads


class SireneWorkflow(BaseDataset):
    """
    Dataset containing legal information of french entities, including communities and companies.
    The column `siren` a the identifier of a structure.

    Given the size of the file, only a subset of the columns is kept,
    enriched with labels corresponding to the activity code.

    https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/
    """

    @classmethod
    def get_config_key(cls) -> str:
        return "sirene"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.input_filename = self.data_folder / "sirene.zip"
        # Track the last download time to enforce rate limiting
        self._last_download_time = 0

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self) -> None:
        if self.output_filename.exists():
            return
        self._fetch_zip()
        self._fetch_xls_files()
        self._format_to_parquet()

    def _fetch_zip(self):
        if self.input_filename.exists():
            return
        self._download_if_not_exists(self.config["url"], self.input_filename)

    def _download_if_not_exists(self, url: str, file_path: Path | None = None) -> Path:
        """
        Download a file from a URL with rate limiting to avoid server throttling.

        Args:
            url: The URL to download from
            file_path: Optional path to save the file to. If not provided, will use the filename from the URL.

        Returns:
            Path to the downloaded file
        """
        if file_path is None:
            file_name = url.split("/")[-1]
            file_path = self.data_folder / file_name

        if file_path.exists():
            LOGGER.info(f"File already exists: {file_path}")
            return file_path

        LOGGER.info(f"Downloading {url} to {file_path}")

        # Enforce rate limiting
        self._enforce_rate_limit()

        # Try to download with retries
        for attempt in range(MAX_RETRIES):
            try:
                # Create a custom opener with proper headers
                opener = urllib.request.build_opener()
                opener.addheaders = [
                    (
                        "User-Agent",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    ),
                    ("Accept", "*/*"),
                ]
                urllib.request.install_opener(opener)

                # Download the file
                urllib.request.urlretrieve(url, file_path)

                # Update last download time
                self._last_download_time = time.time()

                LOGGER.info(f"Successfully downloaded {url}")
                return file_path

            except Exception as e:
                LOGGER.warning(f"Download attempt {attempt + 1}/{MAX_RETRIES} failed: {e}")
                if attempt < MAX_RETRIES - 1:
                    # Wait longer between retries
                    sleep_time = RATE_LIMIT_DELAY * (attempt + 1)
                    LOGGER.info(f"Retrying in {sleep_time} seconds...")
                    time.sleep(sleep_time)
                else:
                    LOGGER.error(f"Failed to download {url} after {MAX_RETRIES} attempts")
                    raise

        return file_path

    def _enforce_rate_limit(self):
        """Enforce a minimum delay between downloads to avoid rate limiting."""
        current_time = time.time()
        elapsed = current_time - self._last_download_time

        if elapsed < RATE_LIMIT_DELAY:
            sleep_time = RATE_LIMIT_DELAY - elapsed
            LOGGER.info(f"Rate limiting: waiting {sleep_time:.2f} seconds")
            time.sleep(sleep_time)

        self._last_download_time = time.time()

    def _fetch_xls_files(self) -> None:
        xls_links = self.config.get("xls_urls_naf", [])
        for file_url in xls_links:
            self._download_if_not_exists(file_url)

        xls_url_cat_ju = self.config.get("xls_urls_cat_ju")
        self._download_if_not_exists(xls_url_cat_ju)

    def join_naf_level(self, base_df: pl.DataFrame, level: str) -> pl.DataFrame:
        """
        Effectue la jointure avec le fichier correspondant au niveau (n1, n2, n3, n4, n5) sur base_df.

        Le code NAF est composé de 5 niveaux :
        - Niveau 0 : correspond au code total (tous les chiffres du code)
        - Niveau 1 : correspond à la lettre (dernier caractère du code)
        - Niveaux 2 à 4 : correspondent respectivement aux 2 à 4 premiers chiffres du code
        """
        column_name = f"naf8_prefix_{level}"
        naf_file_path = self.data_folder / f"naf2008_liste_n{level}.xls"

        naf_polars = pl.read_excel(naf_file_path, read_options={"header_row": 2})

        naf_polars = naf_polars[["Code", "Libellé"]].rename(
            {"Libellé": f"Libellé_naf_n{level}", "Code": column_name}
        )

        naf_polars = naf_polars.with_columns(
            pl.col(column_name).cast(pl.Utf8).str.replace(".", "", literal=True)
        )

        if level == 1:
            slice_func = pl.col("naf8").str.slice(-1)
        else:
            slice_func = pl.col("naf8").str.slice(0, level)

        base_df = base_df.with_columns(
            pl.when(pl.col("nomenclature_naf") == "NAFRev2").then(slice_func).alias(column_name)
        )

        return base_df.join(naf_polars, on=column_name, how="left").drop(column_name)

    def join_juridical_level(
        self,
        base_df: pl.DataFrame,
        level: str,
        categories_ju_data: list[pl.DataFrame],
        code_ju_col: str = "code_ju",
    ) -> pl.DataFrame:
        """
        Effectue la jointure avec les données juridiques correspondant au niveau (niv1, niv2, niv3) sur base_df.
        """
        base_df = base_df.with_columns(pl.col(code_ju_col).cast(pl.Utf8))
        if level in [1, 2]:
            slice_func = pl.col(code_ju_col).str.slice(0, level)
        else:
            slice_func = pl.col(code_ju_col)

        column_name = f"code_ju_part_{level}"
        base_df = base_df.with_columns(
            pl.when(pl.col(code_ju_col).is_not_null()).then(slice_func).alias(column_name)
        )

        juridical_polars = categories_ju_data[level - 1]["Code", "Libellé"].rename(
            {
                "Libellé": f"categorie_juridique_n{level}_name",
                "Code": f"code_ju_part_{level}",
            }
        )
        juridical_polars = juridical_polars.with_columns(pl.col(column_name).cast(pl.Utf8))

        return base_df.join(juridical_polars, on=column_name, how="left").drop(column_name)

    def _format_to_parquet(self):
        if self.output_filename.exists():
            return

        with tempfile.TemporaryDirectory() as tmpdirname:
            with zipfile.ZipFile(self.input_filename) as zip_ref:
                zip_ref.extractall(tmpdirname)
                csv_fn = Path(tmpdirname) / "StockUniteLegale_utf8.csv"

                base_df = (
                    pl.scan_csv(
                        csv_fn, schema_overrides={"trancheEffectifsUniteLegale": pl.String}
                    )
                    .select(
                        col("siren").cast(pl.String).str.zfill(9),
                        (col("etatAdministratifUniteLegale") == "A").alias("is_active"),
                        pl.coalesce(
                            col("nomUsageUniteLegale"),
                            col("denominationUniteLegale"),
                            col("nomUniteLegale"),
                        ).alias("raison_sociale"),
                        col("prenomUsuelUniteLegale").alias("raison_sociale_prenom"),
                        col("activitePrincipaleUniteLegale")
                        .str.replace_all(".", "", literal=True)
                        .alias("naf8"),
                        col("categorieJuridiqueUniteLegale").alias("code_ju"),
                        col("trancheEffectifsUniteLegale")
                        .replace_strict(EFFECTIF_CODE_TO_EMPLOYEES, default=None)
                        .cast(pl.Int32)
                        .alias("tranche_effectif"),
                        col("nomenclatureActivitePrincipaleUniteLegale").alias(
                            "nomenclature_naf"
                        ),
                    )
                    .collect()
                )

        for level in range(1, 6):
            base_df = self.join_naf_level(base_df, level)

        juridical_data_path = self.data_folder / "cj_septembre_2022.xls"
        sheet_levels = ["I", "II", "III"]
        categories_ju_data = [
            pl.read_excel(
                juridical_data_path,
                sheet_name=f"Niveau {level}",
                read_options={"header_row": 3},
            )
            for level in sheet_levels
        ]

        for level in range(1, 4):
            base_df = self.join_juridical_level(
                base_df, level, categories_ju_data=categories_ju_data
            )

        base_df.write_parquet(self.output_filename)
