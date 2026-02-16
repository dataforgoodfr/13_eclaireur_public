import logging
from pathlib import Path

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

LOGGER = logging.getLogger(__name__)

INDEX_SQL_PATH = Path(__file__).resolve().parent.parent / "migrations" / "add_indexes.sql"


class DataWarehouseWorkflow:
    def __init__(self, config: dict):
        self.config = config
        self.warehouse_folder = Path(self.config["warehouse"]["data_folder"])
        self.warehouse_folder.mkdir(exist_ok=True, parents=True)

        self.send_to_db = {
            "collectivites": CommunitiesEnricher.get_output_path(config),
            "marches_publics": MarchesPublicsEnricher.get_output_path(config),
            "subventions": SubventionsEnricher.get_output_path(config),
            "comptes_collectivites": FinancialEnricher.get_output_path(config),
            "elus": ElectedOfficialsEnricher.get_output_path(config),
            "declarations_interet": DeclaInteretWorkflow.get_output_path(config),
            "communities_contacts": CommunitiesContact.get_output_path(config),
            "bareme": BaremeEnricher.get_output_path(config),
        }

    def run(self) -> None:
        ElectedOfficialsEnricher.enrich(self.config)
        FinancialEnricher.enrich(self.config)
        SubventionsEnricher.enrich(self.config)
        MarchesPublicsEnricher.enrich(self.config)
        BaremeEnricher.enrich(self.config)
        CommunitiesEnricher.enrich(self.config)
        self._send_to_postgres()
        self._create_indexes()

    def _send_to_postgres(self):
        if not self.config["workflow"]["save_to_db"]:
            return
        connector = PSQLConnector()

        # replace_tables determines wether we should clean
        # the table and reinsert with new schema
        # or keep the same schema.
        if_table_exists = "replace" if self.config["workflow"]["replace_tables"] else "append"

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

    def _create_indexes(self):
        """Create performance indexes after data has been loaded."""
        if not self.config["workflow"]["save_to_db"]:
            return
        if not INDEX_SQL_PATH.exists():
            LOGGER.warning("Index SQL file not found at %s", INDEX_SQL_PATH)
            return

        LOGGER.info("Creating database indexes from %s ...", INDEX_SQL_PATH.name)
        connector = PSQLConnector()
        sql = INDEX_SQL_PATH.read_text()

        with connector.engine.connect() as conn:
            for statement in sql.split(";"):
                stmt = statement.strip()
                if not stmt or stmt.startswith("--"):
                    continue
                try:
                    conn.execute(text(stmt))
                except Exception as exc:
                    LOGGER.warning("Index creation skipped: %s – %s", stmt[:80], exc)
            conn.commit()
        LOGGER.info("Database indexes created successfully")
