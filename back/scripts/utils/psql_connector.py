import logging
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()  # Charge les variables d'environnement à partir du fichier .env


class PSQLConnector:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.dbname = os.getenv("DB_NAME", "eclaireur_public")
        self.user = os.getenv("DB_USER", "eclaireur_public")
        self.password = os.getenv("DB_PASSWORD", "secret")
        self.host = os.getenv("DB_HOST", "localhost")
        self.port = os.getenv("DB_PORT", "5432")
        self.engine = None

    def close_connection(self):
        if self.engine:
            self.engine.dispose()  # Ferme toutes les connexions ouvertes
            self.logger.info("Database connection closed.")

    def _connect(self):
        if self.engine is not None:
            return
        self.logger.info(f"Connecting to DB {self.host}:{self.port}/{self.dbname}")
        self.engine = create_engine(
            f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.dbname}"
        )

    def save_df_to_sql_drop_existing(
        self,
        save_to_db,
        df,
        table_name,
        chunksize=1000,
        if_exists="replace",
        index=False,
        index_label=None,
    ):
        if not save_to_db:
            return
        self._connect()
        with self.engine.connect() as conn:
            df.drop_duplicates(subset=index_label).to_sql(
                table_name + "test_indices",
                conn,
                if_exists=if_exists,
                index=index,
                chunksize=chunksize,
            )
            self.logger.info("Dataframe saved successfully to the database " + table_name + ".")
