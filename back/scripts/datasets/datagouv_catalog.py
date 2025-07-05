import logging
from pathlib import Path

import numpy as np
import pandas as pd
import polars as pl
from polars import col

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.datasets.utils import BaseDataset
from back.scripts.loaders.base_loader import BaseLoader, retry_session
from back.scripts.utils.dataframe_operation import expand_json_columns, normalize_column_names
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


class DataGouvCatalog(BaseDataset):
    """
    Dataset containing the complete list of urls available on data.gouv, updated daily.

    This workflow depends on Communities (in `add_siren`) to add when available
    the siren of the publishing organisation.
    """

    DATASET_ID = "5d13a8b6634f41070a43dff3"

    @classmethod
    def get_config_key(cls) -> str:
        return "datagouv_catalog"

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self):
        if self.output_filename.exists():
            return

        url = self.config.get("catalog_url") or self._catalog_url()
        if url is None:
            return

        catalog = BaseLoader.loader_factory(url).load()
        if not isinstance(catalog, pd.DataFrame):
            raise RuntimeError("Failed to load dataset")

        catalog = catalog.pipe(normalize_column_names).pipe(
            expand_json_columns, column="extras"
        )

        extra_columns = {
            "extras_check:status": -1,
            "extras_check:headers:content-type": None,
            "extras_analysis:checksum": None,
            "extras_analysis:last-modified-at": None,
            "extras_analysis:last-modified-detection": None,
            "extras_analysis:parsing:parquet_size": None,
            "extras_check:headers:content-md5": None,
        }
        catalog = catalog.assign(
            **{k: v for k, v in extra_columns.items() if k not in catalog.columns}
        )
        if "extras_validation-report:errors" in catalog.columns:
            catalog["extras_validation-report:errors"] = catalog[
                "extras_validation-report:errors"
            ].astype(str)
        columns = np.loadtxt(Path(__file__).parent / "datagouv_catalog_columns.txt", dtype=str)
        catalog = (
            pl.from_pandas(catalog)
            .rename(
                {
                    "dataset_organization_id": "id_datagouv",
                    "type": "type_resource",
                    "extras_check:status": "resource_status",
                    "url": "base_url",
                }
            )
            .with_columns(
                col("resource_status").fill_null(-1).cast(pl.Int16),
                pl.lit(None).cast(pl.String).alias("dataset_description"),
                (
                    pl.lit("https://www.data.gouv.fr/fr/datasets/r/")
                    + col("id").cast(pl.String)
                ).alias("url"),
                col("id").alias("url_hash"),
                col("format")
                .fill_null(col("extras_check:headers:content-type"))
                .fill_null(col("mime"))
                .fill_null(col("extras_analysis:mime-type")),
            )
            .select(*columns)
            .pipe(self._add_siren)
        )

        catalog.write_parquet(self.output_filename)

    def _catalog_url(self) -> str | None:
        """
        Fetch the url of the resource catalog from the page of the dataset.
        The catalog is updated daily, with a title and resource_id change.
        So, we try to get the url of the parquet file from the API first.

        The page itself allows to download a parquet which is dynamically created.
        It weights 7x less but does not appear on the catalog and seems to have a different url daily.
        See the page for investigation : https://www.data.gouv.fr/fr/datasets/catalogue-des-donnees-de-data-gouv-fr/#
        """
        session = retry_session(retries=3)
        response = session.get(
            "https://www.data.gouv.fr/api/1/datasets/catalogue-des-donnees-de-data-gouv-fr/"
        )

        try:
            response.raise_for_status()
        except Exception as e:
            LOGGER.error(f"Failed to fetch data from DataGouv API: {response.text}, {e}")
            return None

        if response.status_code != 200:
            LOGGER.error(f"Failed to fetch data from DataGouv API: {response.text}")
            return None

        catalogs = response.json()
        for catalog in catalogs["resources"]:
            if catalog["title"].startswith("export-resource-"):
                break
        else:
            LOGGER.error("No catalog found.")
            return None

        return catalog["extras"]["analysis:parsing:parquet_url"]

    def _add_siren(self, df: pl.DataFrame) -> pl.DataFrame:
        communities = pl.read_parquet(
            CommunitiesSelector.get_output_path(self.main_config),
            columns=["siren", "id_datagouv"],
        ).filter(col("id_datagouv").is_not_null())
        return df.join(communities, how="left", on="id_datagouv")
