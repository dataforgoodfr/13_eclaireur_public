from pathlib import Path

import polars as pl
from polars import col
from sqlalchemy import text

from back.scripts.utils.psql_connector import PSQLConnector


class DataWarehouseWorkflow:
    def __init__(self, config: dict):
        self._config = config
        self.warehouse_folder = Path(self._config["warehouse"]["data_folder"])
        self.warehouse_folder.mkdir(exist_ok=True, parents=True)

        self.send_to_db = {}

    def run(self) -> None:
        sirene = pl.read_parquet(
            Path(self._config["sirene"]["data_folder"]) / "sirene.parquet"
        ).drop("raison_sociale_prenom")

        self._enrich_subventions(sirene)
        self._send_to_postgres()

    def _send_to_postgres(self):
        connector = PSQLConnector()
        # replace_tables determines wether we should clean
        # the table and reinsert with new schema
        # or keep the same schema.
        if_table_exists = "replace" if self._config["workflow"]["replace_tables"] else "append"

        with connector.engine.connect() as conn:
            for table_name, filename in self.send_to_db.items():
                df = pl.read_parquet(filename)

                if if_table_exists == "append":
                    table_exists_query = text(
                        f"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name= '{table_name}')"
                    )
                    table_exists = conn.execute(table_exists_query).scalar()
                    if table_exists:
                        conn.execute(text(f"TRUNCATE {table_name}"))

                df.write_database(table_name, conn, if_table_exists=if_table_exists)

    def _enrich_subventions(self, sirene: pl.DataFrame):
        """
        Enrich the raw subvention dataset
        """
        subventions = (
            pl.read_parquet(
                self._config["datafile_loader"]["combined_filename"] % {"topic": "subventions"}
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

        out_filename = self.warehouse_folder / "subventions.parquet"
        subventions.write_parquet(out_filename)
        self.send_to_db["subventions"] = out_filename
