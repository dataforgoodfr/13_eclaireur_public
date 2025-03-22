import pandas as pd
from back.scripts.utils.config import get_project_base_path


class SireneLoader:
    """
    SireneLoader loads data from the Sirene dataset, 2023.
    Needed to download the dataset from the INSEE website.
    This dataset lists the companies and their characteristics in France.

    TODO : Refactor using loaders_factory?
    """

    def __init__(self, config):
        filepath = get_project_base_path() / config["scrapped_data_file"]
        self.data = pd.read_csv(filepath, usecols=config["columns"])

    def get(self):
        return self.data
