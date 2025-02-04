import logging
import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()  # Charge les variables d'environnement à partir du fichier .env

class PSQLConnector:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.dbname = os.getenv("DB_NAME")
        self.user = os.getenv("DB_USER")
        self.password = os.getenv("DB_PASSWORD")
        self.host = os.getenv("DB_HOST")
        self.port = os.getenv("DB_PORT")

    def connect(self):
        self.engine = create_engine(f'postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.dbname}')

    def drop_table_if_exists(self, table_name):
        try:
            with self.engine.connect() as conn:
                conn.execute(f"DROP TABLE IF EXISTS {table_name}")
                self.logger.info(f"Table {table_name} dropped successfully.")
        except Exception as e:
            self.logger.error(f"An error occurred while dropping the table: {e}")

    def save_df_to_sql(self, df, table_name, chunksize=1000, if_exists='append', index=False):
        try:
            self.drop_table_if_exists(table_name)
            df.to_sql(table_name, self.engine, if_exists=if_exists, index=index, chunksize=chunksize)
            self.logger.info("Dataframe saved successfully to the database "+table_name+'.')
        except Exception as e:
            self.logger.error(f"An error occurred: {e}")