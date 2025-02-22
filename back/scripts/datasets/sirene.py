import tempfile
import urllib.request
import zipfile
from pathlib import Path

import polars as pl
from polars import col


class SireneWorkflow:
    def __init__(self, source_folder: Path):
        self.data_folder = source_folder / "sirene"
        self.data_folder.mkdir(exist_ok=True, parents=True)

        self.filename = self.data_folder / "sirene.parquet"
        self.URL = "https://files.data.gouv.fr/insee-sirene/StockUniteLegale_utf8.zip"

    def run(self):
        if self.filename.exists():
            return

        zip_filename = self.data_folder / "sirene.zip"
        urllib.request.urlretrieve(self.URL, zip_filename)
        with tempfile.TemporaryDirectory() as tmpdirname:
            with zipfile.ZipFile(zip_filename) as zip_ref:
                zip_ref.extractall(tmpdirname)
                csv_fn = Path(tmpdirname) / "StockUniteLegale_utf8.csv"
                print(csv_fn)
                pl.scan_csv(
                    csv_fn,
                ).select(
                    col("siren"),
                    (col("etatAdministratifUniteLegale") == "A").alias("is_active"),
                    pl.coalesce(
                        col("nomUsageUniteLegale"),
                        col("denominationUniteLegale"),
                        col("nomUniteLegale"),
                    ).alias("raison_sociale"),
                    col("prenomUsuelUniteLegale").alias("prenom"),
                    col("activitePrincipaleUniteLegale").alias("naf8"),
                    col("categorieJuridiqueUniteLegale").alias("code_ju"),
                ).sink_parquet(self.filename)
