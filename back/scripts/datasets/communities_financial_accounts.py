import logging
from collections import Counter
from pathlib import Path

import pandas as pd

from back.scripts.datasets.dataset_aggregator import DatasetAggregator
from back.scripts.loaders.utils import LOADER_CLASSES
from back.scripts.utils.dataframe_operation import normalize_date

LOGGER = logging.getLogger(__name__)


class FinancialAccounts(DatasetAggregator):
    """
    Dataset containing financial number of all french communities across multiple years.
    """

    @classmethod
    def get_config_key(cls) -> str:
        return "financial_accounts"

    def __init__(self, main_config: dict):
        config = main_config[self.get_config_key()]
        files = pd.read_csv(config["files_csv"], sep=";")
        super().__init__(files, main_config)
        self.columns = Counter()
        self.columns_mapping = pd.read_csv(config["columns_mapping"], sep=";").set_index("name")

    def _read_parse_file(
        self, file_metadata: pd.DataFrame, raw_filename: Path
    ) -> pd.DataFrame | None:
        loader = LOADER_CLASSES[file_metadata.format](raw_filename)
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
