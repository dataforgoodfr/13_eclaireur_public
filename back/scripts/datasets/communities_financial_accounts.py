import logging

import pandas as pd

from back.scripts.datasets.dataset_aggregator import DatasetAggregator

LOGGER = logging.getLogger(__name__)


class FinancialAccounts(DatasetAggregator):
    def __init__(self, config: dict):
        files = pd.read_csv(config["files_csv"], sep=";")
        super().__init__(files, config)
