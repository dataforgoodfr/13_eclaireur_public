import logging
import tempfile
import urllib.request
import zipfile
from pathlib import Path
import pandas as pd

import polars as pl
from polars import col

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


class SireneWorkflow:
    """
    https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/
    """

    def __init__(self, config: dict):
        self._config = config
        self.data_folder = Path(self._config["data_folder"])
        self.data_folder.mkdir(exist_ok=True, parents=True)

        self.filename = self.data_folder / "sirene.parquet"
        self.zip_filename = self.data_folder / "sirene.zip"

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self) -> None:
        self._fetch_zip()
        self._fetch_xls_files()
        self._format_to_parquet()

    def _fetch_zip(self):
        if self.zip_filename.exists():
            return
        urllib.request.urlretrieve(self._config["url"], self.zip_filename)

    def _fetch_xls_files(self):
        xls_links = self._config.get("xls_urls_naf", [])
        for file_url in xls_links:
            file_name = file_url.split("/")[-1]
            file_path = self.data_folder / file_name
            if not file_path.exists():
                urllib.request.urlretrieve(file_url, file_path)

        xls_url_cat_ju = self._config.get("xls_url_cat_ju")

        if xls_url_cat_ju:
            file_name = xls_url_cat_ju.split("/")[-1]
            file_path = self.data_folder / file_name
            if not file_path.exists():
                urllib.request.urlretrieve(xls_url_cat_ju, file_path)

    def join_naf_level(
        self,
        base_df,
        level,
        nomenclature_filter_col="nomenclature_naf",
        nomenclature_value="NAFRev2",
    ):
        """
        Effectue la jointure avec le fichier correspondant au niveau (n1, n2, n3, n4, n5) sur base_df.
        """
        column_name = f"naf8_prefix_{level}"
        naf_file_path = self.data_folder / f"naf2008_liste_n{level}.xls"

        naf_df = pd.read_excel(naf_file_path, header=2)[["Code", "Libellé"]]
        naf_df["Code"] = naf_df["Code"].astype(str).str.replace(".", "", regex=False)
        naf_polars = pl.from_pandas(naf_df[["Code", "Libellé"]]).rename(
            {"Libellé": f"Libellé_naf_n{level}", "Code": column_name}
        )

        # Le code NAF est composé de 5 niveaux :
        # - Niveau 0 : correspond au code total (tous les chiffres du code)
        # - Niveau 1 : correspond à la lettre (dernier caractère du code)
        # - Niveaux 2 à 4 : correspondent respectivement aux 2 à 4 premiers chiffres du code
        if level == 1:
            slice_func = pl.col("naf8").str.slice(-1)
        else:
            slice_func = pl.col("naf8").str.slice(0, level)

        base_df = base_df.with_columns(
            pl.when(pl.col("nomenclature_naf") == "NAFRev2")
            .then(slice_func)
            .otherwise(None)
            .alias(column_name)
        )

        return base_df.join(naf_polars, on=column_name, how="left").drop(column_name)

    def join_juridical_level(self, base_df, level, categories_ju_data, code_ju_col="code_ju"):
        """
        Effectue la jointure avec les données juridiques correspondant au niveau (niv1, niv2, niv3) sur base_df.
        """
        base_df = base_df.with_columns(pl.col(code_ju_col).cast(pl.Utf8))

        slice_func = pl.col(code_ju_col).str.slice(0, level)

        column_name = f"code_ju_part_{level}"
        base_df = base_df.with_columns(
            pl.when(pl.col(code_ju_col).is_not_null())
            .then(slice_func)
            .otherwise(None)
            .alias(column_name)
        )

        juridical_data = categories_ju_data[level - 1]
        juridical_polars = pl.from_pandas(juridical_data[["Code", "Libellé"]]).rename(
            {"Libellé": f"categorie_juridique_n{level}_name", "Code": column_name}
        )

        juridical_polars = juridical_polars.with_columns(pl.col(column_name).cast(pl.Utf8))

        return base_df.join(
            juridical_polars,
            on=column_name,
            how="left",
        ).drop(column_name)

    def _format_to_parquet(self):
        if self.filename.exists():
            return

        with tempfile.TemporaryDirectory() as tmpdirname:
            with zipfile.ZipFile(self.zip_filename) as zip_ref:
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
            pd.read_excel(juridical_data_path, sheet_name=f"Niveau {level}", header=3)
            for level in sheet_levels
        ]

        for level in range(1, 4):
            base_df = self.join_juridical_level(
                base_df, level, categories_ju_data=categories_ju_data
            )

        base_df.write_parquet(self.filename)
