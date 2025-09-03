import hashlib
import logging
import os

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()  # Charge les variables d'environnement à partir du fichier .env


class PSQLConnector:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

        self.dbname = os.getenv("DB_NAME", "eclaireur_public")
        self.user = os.getenv("DB_USER", "eclaireur_public")
        self.password = os.getenv("DB_PASSWORD", "secret")
        self.host = os.getenv("DB_HOST", "localhost")
        self.port = os.getenv("DB_PORT", "5436")
        self.engine = None
        self._connect()

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
