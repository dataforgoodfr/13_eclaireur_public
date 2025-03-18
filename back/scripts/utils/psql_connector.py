import hashlib
import logging
import os

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()  # Charge les variables d'environnement à partir du fichier .env


class PSQLConnector:
    def __init__(self, replace_tables):
        self.logger = logging.getLogger(__name__)

        self.dbname = os.getenv("DB_NAME", "eclaireur_public")
        self.user = os.getenv("DB_USER", "eclaireur_public")
        self.password = os.getenv("DB_PASSWORD", "secret")
        self.host = os.getenv("DB_HOST", "localhost")
        self.port = os.getenv("DB_PORT", "5432")
        self.replace_tables = replace_tables
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


class Historisateur:
    """
    This class is currently dead code but the logic will be used
    for source historisation.
    """

    def drop_table_if_exists(self, table_name):
        try:
            with self.engine.connect() as conn:
                conn.execute(f"DROP TABLE IF EXISTS {table_name}")
                self.logger.info(f"Table {table_name} dropped successfully.")
        except Exception as e:
            self.logger.error(f"An error occurred while dropping the table: {e}")

    def generate_primary_key_hash(self, row, primary_keys):
        """Génère un hash à partir des clés primaires"""
        pk_values = [str(row[pk]) for pk in primary_keys]
        return hashlib.sha256("".join(pk_values).encode("utf-8")).hexdigest()

    def save_new_table(self, conn, df: pd.DataFrame, table_name: str, primary_keys: list):
        df["primary_key_hash"] = df.apply(
            lambda row: self.generate_primary_key_hash(row, primary_keys), axis=1
        )
        df["deleted_flag"] = False
        df.to_sql(table_name, con=conn, if_exists="replace")
        conn.commit()

    def convert_types_for_sql(
        self,
        conn,
        df: pd.DataFrame,
        existing_df: pd.DataFrame,
        table_name: str,
        primary_keys: list,
    ) -> pd.DataFrame:
        sql = text(
            f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table_name}';"
        )
        result = conn.execute(sql)
        column_mapping = {row[0]: row[1] for row in result.fetchall()}
        SQL_TO_PYTHON_TYPES = {
            "integer": "int64",
            "bigint": "int64",
            "smallint": "int64",
            "decimal": "float64",
            "numeric": "float64",
            "real": "float32",
            "double precision": "float64",
            "boolean": "bool",
            "char": "string",
            "varchar": "string",
            "text": "string",
            "date": "datetime64[ns]",
            "timestamp": "datetime64[ns]",
            "timestamp without time zone": "datetime64[ns]",
            "timestamp with time zone": "datetime64[ns, UTC]",
        }

        common_columns = set(existing_df.columns) & set(df.columns) - set(primary_keys)
        for col in common_columns:
            df[col] = df[col].astype(SQL_TO_PYTHON_TYPES[column_mapping[col]])
            existing_df[col] = existing_df[col].astype(SQL_TO_PYTHON_TYPES[column_mapping[col]])
        return df, existing_df

    def upsert_df_to_sql(self, df, table_name, primary_keys):
        """
        Upserts data into the database:
        - Inserts new rows
        - Updates existing rows if they have changed
        - Soft deletes rows that are no longer present in the DataFrame

        :param df: DataFrame to insert/update
        :param table_name: Target table name
        :param primary_keys: List of primary key columns to identify unique rows
        :param soft_delete: If True, sets a 'deleted_flag' on deleting rows
        """
        with self.engine.connect() as conn:
            if not conn.dialect.has_table(conn, table_name) or self.replace_tables:
                self.save_new_table(conn, df, table_name, primary_keys)

            else:
                existing_df = pd.read_sql(f"SELECT * FROM {table_name}", conn)
                df["primary_key_hash"] = ""
                self.add_new_columns(conn, table_name, existing_df, df)
                existing_df = pd.read_sql(f"SELECT * FROM {table_name}", conn)

                df["primary_key_hash"] = df.apply(
                    lambda row: self.generate_primary_key_hash(row, primary_keys), axis=1
                )

                primary_keys += ["primary_key_hash"]

                df, existing_df = self.convert_types_for_sql(
                    conn, df, existing_df, table_name, primary_keys
                )

                if "deleted_flag" not in df.columns:
                    df["deleted_flag"] = False

                df = self.clean_df(df)
                existing_df = self.clean_df(existing_df)
                merged_df = df.merge(
                    existing_df,
                    on=primary_keys,
                    how="outer",
                    indicator=True,
                    suffixes=("", "_existing"),
                )
                merged_df = self.clean_df(merged_df)

                self.update_rows(
                    conn, table_name, merged_df, existing_df.columns, df.columns, primary_keys
                )

                self.new_rows(conn, table_name, merged_df, df.columns)

                self.soft_delete_rows(conn, table_name, merged_df, df.columns)

    def clean_df(self, df):
        df.replace({np.nan: None}, inplace=True)
        return df

    def update_rows(
        self,
        conn,
        table_name: str,
        merged_df: pd.DataFrame,
        existing_df_columns: list,
        df_columns: list,
        primary_keys: list,
    ):
        common_columns = set(existing_df_columns) & set(df_columns) - set(primary_keys)

        # get modified rows
        df_common_columns = [col for col in common_columns if col in df_columns]
        df_existing_common_columns = [
            col + "_existing" for col in common_columns if col in existing_df_columns
        ]
        diff_mask = (
            merged_df[df_common_columns] != merged_df[df_existing_common_columns].values
        ).any(axis=1)

        # keep rows to update
        updated_rows = merged_df[diff_mask]

        # keep updated rows columns
        updated_rows = updated_rows[df_columns]

        # Updated rows: Present in both but with changed values
        updated_cols = [col for col in df_columns if col not in primary_keys]
        [f"{col}_existing" for col in updated_cols]

        if not updated_rows.empty:
            for _, row in updated_rows.iterrows():
                set_clause = ", ".join(
                    [f""""{col}" = :{col}""" for col in df_columns if col not in primary_keys]
                )
                where_clause = "primary_key_hash = :primary_key_hash"

                sql = text(f"""
                    UPDATE {table_name}
                    SET {set_clause}
                    WHERE {where_clause}
                """)

                conn.execute(sql, row.to_dict())
            conn.commit()

            self.logger.info(f"{len(updated_rows)} rows updated in {table_name}.")

    def add_new_columns(
        self, conn, table_name: str, existing_df: pd.DataFrame, df: pd.DataFrame
    ):
        new_columns = set(df.columns) - set(existing_df.columns)

        type_mapping = {
            "int64": "INTEGER",
            "float64": "FLOAT",
            "bool": "BOOLEAN",
            "datetime64[ns]": "TIMESTAMP",
            "object": "TEXT",
        }

        for col in new_columns:
            col_type = type_mapping.get(str(df[col].dtype), "TEXT")
            sql = text(f"ALTER TABLE {table_name} ADD COLUMN {col} {col_type};")
            conn.execute(sql)
            conn.commit()

        self.logger.info(f"Added {len(new_columns)} new columns to {table_name}.")

    def new_rows(self, conn, table_name: str, merged_df: pd.DataFrame, df_columns: list):
        new_rows = merged_df[merged_df["_merge"] == "left_only"].drop(columns=["_merge"])
        new_rows = new_rows[df_columns]

        if not new_rows.empty:
            new_rows.to_sql(table_name, conn, if_exists="append", index=False)
            self.logger.info(f"{len(new_rows)} new rows inserted into {table_name}.")

    def soft_delete_rows(
        self, conn, table_name: str, merged_df: pd.DataFrame, primary_keys: list
    ):
        soft_delete_rows = merged_df[merged_df["_merge"] == "right_only"][primary_keys]
        if not soft_delete_rows.empty:
            where_clause = "primary_key_hash = :primary_key_hash"
            sql = text(f"""
                UPDATE {table_name}
                SET deleted_flag = true
                WHERE {where_clause}
            """)
            conn.execute(sql, soft_delete_rows.to_dict(orient="records"))
            self.logger.info(f"{len(soft_delete_rows)} rows soft deleted in {table_name}.")
            self.logger.info(f"{len(soft_delete_rows)} rows soft deleted in {table_name}.")
