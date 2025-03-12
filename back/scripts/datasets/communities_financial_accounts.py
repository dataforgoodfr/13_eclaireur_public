import logging
from collections import Counter
from pathlib import Path

import pandas as pd

from back.scripts.datasets.dataset_aggregator import LOADER_CLASSES, DatasetAggregator

LOGGER = logging.getLogger(__name__)


class FinancialAccounts(DatasetAggregator):
    def __init__(self, config: dict):
        files = pd.read_csv(config["files_csv"], sep=";")
        super().__init__(files, config)
        self.columns = Counter()
        self.columns_mapping = pd.read_csv(config["columns_mapping"], sep=";").set_index("name")

    def _read_parse_file(self, file_metadata: tuple, raw_filename: Path) -> pd.DataFrame | None:
        loader = LOADER_CLASSES[file_metadata.format](raw_filename)
        df = loader.load().assign(type=file_metadata.type)
        self.columns.update(df.columns)
        selected_columns = {
            v: k for k, v in self.columns_mapping[file_metadata.type].dropna().to_dict().items()
        }
        return df[selected_columns.keys()].rename(columns=selected_columns)
