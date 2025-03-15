import polars as pl
from polars import col

from back.scripts.datasets.common import WorkflowMixin
from back.scripts.datasets.sirene import SireneWorkflow
from back.scripts.utils.config import project_config


class DataWarehouseWorkflow(WorkflowMixin):
    config_key_name: str = "warehouse"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.send_to_db = []

    def run(self) -> None:
        sirene = pl.read_parquet(SireneWorkflow().parquet_filename).drop(
            "raison_sociale_prenom"
        )

        self._enrich_subventions(sirene)

    def _enrich_subventions(self, sirene: pl.DataFrame):
        """
        Enrich the raw subvention dataset
        """
        subventions = (
            pl.read_parquet(
                project_config["datafile_loader"]["combined_filename"]
                % {"topic": "subventions"}
            )
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

        out_filename = self.data_folder / "subventions.parquet"
        subventions.write_parquet(out_filename)
        self.send_to_db.append(out_filename)
