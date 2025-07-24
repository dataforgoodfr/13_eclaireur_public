from pathlib import Path

import pandas as pd
import polars as pl
from sqlalchemy import text

from back.scripts.datasets.communities_contacts import CommunitiesContact
from back.scripts.datasets.declaration_interet import DeclaInteretWorkflow
from back.scripts.enrichment.bareme_enricher import BaremeEnricher
from back.scripts.enrichment.communities_enricher import CommunitiesEnricher
from back.scripts.enrichment.elected_officials_enricher import ElectedOfficialsEnricher
from back.scripts.enrichment.financial_account_enricher import FinancialEnricher
from back.scripts.enrichment.marches_enricher import MarchesPublicsEnricher
from back.scripts.enrichment.subventions_enricher import SubventionsEnricher
from back.scripts.utils.psql_connector import PSQLConnector


class DataWarehouseWorkflow:
    def __init__(self, config: dict):
        self._config = config
        self.warehouse_folder = Path(self._config["warehouse"]["data_folder"])
        self.warehouse_folder.mkdir(exist_ok=True, parents=True)
        self.chunksize = 10000

        self.send_to_db = {
            "collectivites_test": CommunitiesEnricher.get_output_path(config),
            "marches_publics_test": MarchesPublicsEnricher.get_output_path(config),
            "subventions_test": SubventionsEnricher.get_output_path(config),
            "comptes_collectivites_test": FinancialEnricher.get_output_path(config),
            "elus_test": ElectedOfficialsEnricher.get_output_path(config),
            "declarations_interet_test": DeclaInteretWorkflow.get_output_path(config),
            "communities_contacts_test": CommunitiesContact.get_output_path(config),
            "bareme_test": BaremeEnricher.get_output_path(config),
        }

    def run(self) -> None:
        ElectedOfficialsEnricher.enrich(self._config)
        FinancialEnricher.enrich(self._config)
        SubventionsEnricher.enrich(self._config)
        MarchesPublicsEnricher.enrich(self._config)
        BaremeEnricher.enrich(self._config)
        CommunitiesEnricher.enrich(self._config)
        self._send_to_postgres()

    def _send_to_postgres(self):
        if not self._config["workflow"]["save_to_db"]:
            return
        connector = PSQLConnector()

        # replace_tables determines wether we should clean
        # the table and reinsert with new schema
        # or keep the same schema.
        if_table_exists = "replace" if self._config["workflow"]["replace_tables"] else "append"

        with connector.engine.begin() as conn:
            for table_name, filename in self.send_to_db.items():
                df = pl.read_parquet(filename)

                if if_table_exists == "append":
                    table_exists_query = text(
                        f"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name= '{table_name}')"
                    )
                    table_exists = conn.execute(table_exists_query).scalar()

                    if table_exists:
                        conn.execute(text(f"TRUNCATE {table_name}"))
                        self.add_missing_columns_to_sql_table(conn, table_name, df)
                    df.to_pandas().to_sql(
                        table_name, conn, if_exists=if_table_exists, chunksize=self.chunksize
                    )

    @staticmethod
    def add_missing_columns_to_sql_table(conn, table_name: str, df: pl.DataFrame):
        """Ajoute les colonnes manquantes dans la table SQL à partir du DataFrame Polars."""

        schema = df.schema
        columns_sql = conn.execute(
            text(f"""
            SELECT column_name FROM information_schema.columns
            WHERE table_name = '{table_name}'
        """)
        ).fetchall()
        existing_cols = {col[0] for col in columns_sql}

        missing_cols = schema.keys() - existing_cols
        if not missing_cols:
            return

        # Mapping Polars -> SQL
        type_mapping = {
            pl.Int64: "BIGINT",
            pl.Int32: "INTEGER",
            pl.Float64: "DOUBLE PRECISION",
            pl.Float32: "REAL",
            pl.Boolean: "BOOLEAN",
            pl.Utf8: "TEXT",
            pl.Date: "DATE",
            pl.Datetime: "TIMESTAMP",
        }

        if missing_cols:
            add_columns = []
            for col in missing_cols:
                pl_type = schema[col]
                sql_type = type_mapping.get(pl_type, "TEXT")
                add_columns.append(f'ADD COLUMN "{col}" {sql_type}')

            alter_query = f'ALTER TABLE "{table_name}" {", ".join(add_columns)};'
            conn.execute(text(alter_query))
            conn.commit()
