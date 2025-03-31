import logging
from pathlib import Path

import pandas as pd
import polars as pl
from polars import col

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.utils.config import get_combined_filename
from back.scripts.utils.datagouv_api import DataGouvAPI
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


class DataGouvCatalog:
    DATASET_ID = "5d13a8b6634f41070a43dff3"

    @classmethod
    def get_config_key(cls) -> str:
        return "datagouv_catalog"

    @classmethod
    def get_output_path(cls, main_config: dict) -> Path:
        return get_combined_filename(main_config, cls.get_config_key())

    def __init__(self, main_config: dict):
        self.main_config = main_config
        self._config = main_config[self.get_config_key()]
        self.data_folder = Path(self._config["data_folder"])
        self.data_folder.mkdir(exist_ok=True, parents=True)
        self.output_filename = DataGouvCatalog.get_output_path(main_config)
        self.output_filename.parent.mkdir(exist_ok=True, parents=True)

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self):
        if self.output_filename.exists():
            return

        url = self._config.get("catalog_url") or self._catalog_url()

        df = BaseLoader.loader_factory(url).load()
        if not isinstance(df, pd.DataFrame):
            raise RuntimeError("Failed to load dataset")
        pl.from_pandas(df).rename({"dataset.organization_id": "id_datagouv"}).pipe(
            self._add_siren
        ).write_parquet(self.output_filename)

    def _catalog_url(self):
        """
        Fetch the url of the resource catalog from the page of the dataset.
        The catalog is updated daily, with a title change so there is high chance
        that the resource_id we are interested changes daily too.

        The page itself allows to download a parquet which is dynamically created.
        It weights 7x less but does not appear on the catalog and seems to have a different url daily.
        See the page for investigation : https://www.data.gouv.fr/fr/datasets/catalogue-des-donnees-de-data-gouv-fr/#
        """
        catalog_dataset = DataGouvAPI.dataset_resources(
            self.DATASET_ID, savedir=self.data_folder
        ).pipe(lambda df: df[df["resource_url"].str.contains("export-resource")])
        if catalog_dataset.empty:
            raise Exception("No catalog dataset found.")

        return catalog_dataset["resource_url"].iloc[0]

    def _add_siren(self, df: pl.DataFrame) -> pl.DataFrame:
        communities = pl.read_parquet(
            CommunitiesSelector.get_output_path(self.main_config),
            columns=["siren", "id_datagouv"],
        ).filter(col("id_datagouv").is_not_null())
        return df.join(communities, how="left", on="id_datagouv")
