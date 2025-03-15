import logging
from pathlib import Path

import pandas as pd

from back.scripts.loaders.csv_loader import CSVLoader
from back.scripts.utils.datagouv_api import DataGouvAPI
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


class DataGouvCatalog:
    DATASET_ID = "5d13a8b6634f41070a43dff3"

    def __init__(self, config: dict):
        self._config = config
        self.data_folder = Path(config["data_folder"])
        self.data_folder.mkdir(exist_ok=True, parents=True)
        self.filename = Path(config["combined_filename"])
        self.filename.parent.mkdir(exist_ok=True, parents=True)

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self):
        if self.filename.exists():
            return

        catalog_dataset = DataGouvAPI.dataset_resources(
            self.DATASET_ID, savedir=self.data_folder
        ).pipe(lambda df: df[df["resource_url"].str.contains("export-resource")])
        if catalog_dataset.empty:
            raise Exception("No catalog dataset found.")

        url = catalog_dataset["resource_url"].iloc[0]
        df = CSVLoader(url).load()
        if not isinstance(df, pd.DataFrame):
            raise RuntimeError("Failed to load dataset")
        df.to_parquet(self.filename)
