from pathlib import Path

import polars as pl
from polars import col


class DataWarehouseWorkflow:
    def __init__(self, config: dict):
        self._config = config
        self.warehouse_folder = Path(self._config["warehouse"]["data_folder"])
        self.warehouse_folder.mkdir(exist_ok=True, parents=True)

        self.send_to_db = []

    def run(self):
        sirene = pl.read_parquet(
            Path(self._config["sirene"]["data_folder"]) / "sirene.parquet"
        ).drop("raison_sociale_prenom")

        self._enrich_subventions(sirene)

    def _enrich_subventions(self, sirene: pl.DataFrame):
        """
        Enrich the raw subvention dataset
        """
        subventions = (
            pl.read_parquet("back/data/datasets/subventions.parquet")
            .with_columns(
                # Transform idAttribuant from siret to siren.
                # Data should already be normalized to 15 caracters.
                col("idAttribuant").str.slice(0, 9).alias("idAttribuant"),
                col("idBeneficiaire").str.slice(0, 9).alias("idBeneficiaire"),
            )
            .join(
                # Give the official sirene name to the attribuant
                sirene.select("siren", "raison_sociale"),
                left_on="idAttribuant",
                right_on="siren",
                how="left",
            )
            .with_columns(
                col("raison_sociale").fill_null(col("nomAttribuant")).alias("nomAttribuant")
            )
            .drop("raison_sociale")
            .join(
                # Give the official sirene name to the beneficiaire
                sirene.rename(lambda col: col + "_beneficiaire"),
                left_on="idBeneficiaire",
                right_on="siren_beneficiaire",
                how="left",
            )
            .with_columns(
                col("raison_sociale_beneficiaire")
                .fill_null(col("nomBeneficiaire"))
                .alias("nomBeneficiaire"),
                col("raison_sociale_beneficiaire")
                .is_not_null()
                .alias("is_valid_siren_beneficiaire"),
            )
            .drop("raison_sociale_beneficiaire")
        )

        out_filename = self.warehouse_folder / "subventions.parquet"
        subventions.write_parquet(out_filename)
        self.send_to_db.append(out_filename)
