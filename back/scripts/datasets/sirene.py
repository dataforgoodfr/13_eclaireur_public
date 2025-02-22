import tempfile
import urllib.request
import zipfile
from pathlib import Path

import polars as pl
from polars import col

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

    def __init__(self, source_folder: Path):
        self.data_folder = source_folder / "sirene"
        self.data_folder.mkdir(exist_ok=True, parents=True)

        self.filename = self.data_folder / "sirene.parquet"
        self.URL = "https://files.data.gouv.fr/insee-sirene/StockUniteLegale_utf8.zip"

        self.zip_filename = self.data_folder / "sirene.zip"

    def run(self):
        self._fetch_zip()
        self._format_to_parquet()

    def _fetch_zip(self):
        if self.zip_filename.exists():
            return
        urllib.request.urlretrieve(self.URL, self.zip_filename)

    def _format_to_parquet(self):
        if self.filename.exists():
            return

        with tempfile.TemporaryDirectory() as tmpdirname:
            with zipfile.ZipFile(self.zip_filename) as zip_ref:
                zip_ref.extractall(tmpdirname)
                csv_fn = Path(tmpdirname) / "StockUniteLegale_utf8.csv"
                pl.scan_csv(
                    csv_fn, schema_overrides={"trancheEffectifsUniteLegale": pl.String}
                ).select(
                    col("siren").cast(pl.String).str.zfill(9),
                    (col("etatAdministratifUniteLegale") == "A").alias("is_active"),
                    pl.coalesce(
                        col("nomUsageUniteLegale"),
                        col("denominationUniteLegale"),
                        col("nomUniteLegale"),
                    ).alias("raison_sociale"),
                    col("prenomUsuelUniteLegale").alias("prenom"),
                    col("activitePrincipaleUniteLegale")
                    .str.replace_all(".", "", literal=True)
                    .alias("naf8"),
                    col("categorieJuridiqueUniteLegale").alias("code_ju"),
                    col("trancheEffectifsUniteLegale")
                    .replace_strict(EFFECTIF_CODE_TO_EMPLOYEES, default=None)
                    .cast(pl.Int32)
                    .alias("tranche_effectif"),
                ).collect().write_parquet(self.filename)
