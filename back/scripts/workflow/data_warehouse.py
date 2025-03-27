from pathlib import Path

import polars as pl
from sqlalchemy import text

from back.scripts.enrichment.subventions_enricher import SubventionsEnricher
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

        SubventionsEnricher.enrich_subventions(self._config, sirene)
        self.send_to_db = {
            "subventions": self.warehouse_folder / "subventions.parquet"
        }  # temp hack
        self._send_to_postgres()

    def _send_to_postgres(self):
        if not self._config["workflow"]["save_to_db"]:
            return
        connector = PSQLConnector()

        step = "bla"
        if step == "subventions_enricher":
            producer = SubventionsEnricher
        producer.get_output_path(self._config)

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
