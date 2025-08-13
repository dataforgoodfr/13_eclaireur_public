import logging
from collections import Counter
from datetime import datetime
from pathlib import Path

import pandas as pd
import requests

from back.scripts.datasets.dataset_aggregator import DatasetAggregator
from back.scripts.loaders import BaseLoader
from back.scripts.utils.dataframe_operation import normalize_date
from back.scripts.utils.typing import PandasRow

LOGGER = logging.getLogger(__name__)

CHANGELOG_BASE_URL='https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/{datasetid}?timezone=UTC&include_links=false&include_app_metas=false'

class FinancialAccounts(DatasetAggregator):
    """
    Dataset containing financial number of all french communities across multiple years.
    """

    @classmethod
    def get_config_key(cls) -> str:
        return "financial_accounts"

    @classmethod
    def from_config(cls, main_config):
        files = pd.read_csv(main_config[cls.get_config_key()]["files_csv"], sep=";")
        return cls(files, main_config)
    
    def __init__(self, files: pd.DataFrame, main_config: dict):
        super().__init__(files, main_config)
        
        self.columns = Counter()
        self.columns_mapping = pd.read_csv(main_config[self.get_config_key()]["columns_mapping"], sep=";").set_index("name")

        last_updates = self.files_in_scope["datasetid"].apply(self._retrieve_last_modification_date)
        self.files_in_scope = self.files_in_scope.assign(last_update=last_updates)
        
    def _retrieve_last_modification_date(self, datasetid: str) -> str:
        """
        return last modification date for a datasetid of today.
        """
        last_updated = datetime.now().strftime("%Y-%m-%d")

        url = CHANGELOG_BASE_URL.format(datasetid=datasetid)
        resp = requests.get(url)
        if resp.status_code == 200:
            resp_j = resp.json()
            if (
                "metas" in resp_j
                and "default" in resp_j["metas"]
                and "modified" in resp_j["metas"]["default"]
            ):
                return datetime.strptime(resp_j["metas"]["default"]["modified"], "%Y-%m-%dT%H:%M:%S.%f%z").replace(tzinfo=None)
        return last_updated

    def _read_parse_file(
        self, file_metadata: PandasRow, raw_filename: Path
    ) -> pd.DataFrame | None:
        loader = BaseLoader.loader_factory(raw_filename)
        df = loader.load().assign(type=file_metadata.type)
        self.columns.update(df.columns)
        selected_columns = {
            v: k for k, v in self.columns_mapping[file_metadata.type].dropna().to_dict().items()
        }
        return (
            df[selected_columns.keys()]
            .rename(columns=selected_columns)
            .pipe(normalize_date, id_col="exercice")
            .assign(annee=lambda df: df["exercice"].dt.year)
        )
