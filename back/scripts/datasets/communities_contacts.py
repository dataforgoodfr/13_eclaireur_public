import json
import os
import tarfile
import urllib.request
from io import StringIO
from pathlib import Path

import pandas as pd

from back.scripts.datasets.datagouv_catalog import DataGouvCatalog
from back.scripts.utils.config import get_project_base_path


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
        if not self.interm_filename.exists():
            url = self._db_url()
            urllib.request.urlretrieve(url, self.interm_filename)

        if not self.extracted_dir.exists():
            with tarfile.open(self.interm_filename, "r:bz2") as tar:
                tar.extractall(path=self.extracted_dir)

        filename = [fn for fn in os.listdir(self.extracted_dir) if Path(fn).suffix == ".json"][
            0
        ]
        with open(self.extracted_dir / filename, "r") as f:
            content = json.load(f)["service"]
            print(type(content))
            df = pd.read_json(StringIO(json.dumps(content)))
        print(df)
        df.to_parquet(self.output_filename)

    def _db_url(self):
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
