import json
import os
import tarfile
import urllib.request
from io import StringIO
from pathlib import Path

import pandas as pd
import polars as pl
from polars import col

from back.scripts.datasets.datagouv_catalog import DataGouvCatalog
from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.dataframe_operation import IdentifierFormat, normalize_identifiant


class CommunitiesContact:
    DATASET_ID = "53699fe4a3a729239d206227"

    @classmethod
    def get_config_key(cls) -> str:
        return "communities_contacts"

    @classmethod
    def get_output_path(cls, main_config: dict) -> Path:
        return (
            get_project_base_path()
            / main_config[cls.get_config_key()]["data_folder"]
            / "communities_contacts.parquet"
        )

    def __init__(self, config: dict):
        self.main_config = config
        self.config = config[self.get_config_key()]
        self.data_folder = Path(self.config["data_folder"])
        self.data_folder.mkdir(exist_ok=True, parents=True)

        self.output_filename = self.get_output_path(config)
        self.interm_filename = self.data_folder / "raw.tar.bz2"

        self.extracted_dir = self.data_folder / "extracted"

    def run(self):
        if self.output_filename.exists():
            return
        self._download_targz()
        self._extract_targz()

        filename = [
            fn
            for fn in os.listdir(self.extracted_dir)
            if Path(fn).suffix == ".json" and not fn.startswith("._")
        ][0]
        with open(self.extracted_dir / filename, "r") as f:
            content = json.load(f)["service"]
            df = (
                pd.read_json(StringIO(json.dumps(content)))
                .pipe(normalize_identifiant, "siren", format=IdentifierFormat.SIREN)
                .pipe(normalize_identifiant, "siret", format=IdentifierFormat.SIRET)
            )
            df = (
                pl.from_pandas(df)
                .select(
                    "nom",
                    "pivot",
                    col("siren").fill_null(col("siret").str.slice(0, 9)).alias("siren"),
                    "sve",
                    "adresse_courriel",
                    "formulaire_contact",
                )
                .pipe(self.parse_pivot)
                .filter(col("type").is_not_null())
                .pipe(self.normalize_contact)
                .filter(col("contact").is_not_null())
            )
        df.write_parquet(self.output_filename)

    def _download_targz(self):
        if self.interm_filename.exists():
            return
        url = self._db_url()
        urllib.request.urlretrieve(url, self.interm_filename)

    def _extract_targz(self):
        if self.extracted_dir.exists():
            return
        with tarfile.open(self.interm_filename, "r:bz2") as tar:
            tar.extractall(path=self.extracted_dir)

    def _db_url(self):
        url = self.config["url"]
        if url:
            return url

        resource_id = (
            pd.read_parquet(DataGouvCatalog.get_output_path(self.main_config))
            .pipe(
                lambda df: df.loc[
                    (df["dataset_id"] == self.DATASET_ID)
                    & (df["title"] == "Base de données locales de Service-public"),
                    "id",
                ]
            )
            .to_list()[0]
        )
        return f"https://www.data.gouv.fr/fr/datasets/r/{resource_id}"

    def parse_pivot(self, df: pl.DataFrame) -> pl.DataFrame:
        matching = {"cg": "DEP", "cr": "REG", "mairie": "COM", "epci": "MET"}
        return (
            df.explode("pivot")
            .with_columns(
                pl.col("pivot").struct[1].replace_strict(matching, default=None).alias("type")
            )
            .with_columns(
                pl.col("pivot").struct[0].alias("code_insee"),
            )
            .with_columns(
                pl.when(col("code_insee").list.len() > 0).then(
                    col("code_insee").list[0].str.zfill(5)
                )
            )
            .drop("pivot")
        )

    def normalize_contact(self, df: pl.DataFrame) -> pl.DataFrame:
        contacts = ["sve", "adresse_courriel", "formulaire_contact"]
        return (
            df.with_columns(pl.concat_list(contacts).list.unique().alias("contact"))
            .drop(contacts)
            .explode("contact")
            .with_columns(
                pl.when(pl.col("contact").str.contains("@"))
                .then(pl.lit("MAIL"))
                .otherwise(
                    pl.when(col("contact").str.contains("(http|www)")).then(pl.lit("WEB"))
                )
                .alias("type_contact")
            )
        )
