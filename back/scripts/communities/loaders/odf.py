from pathlib import Path
import pandas as pd

from scripts.utils.files_operation import save_csv
from scripts.loaders.base_loader import BaseLoader
from scripts.utils.config import get_project_base_path


class OdfLoader:
    """
    OdfLoader loads data from the ODF dataset and saves it to a CSV file.
    Data from OpenDataFrance, data.gouv.fr, 2022.
    This dataset lists the platforms and organizations that contribute to the development of open data in the territories, identified during the 2022 edition (as of December 31).

    TODO : Refactor using loaders_factory
    """

    def __init__(self, config):
        data_folder = Path(get_project_base_path()) / config["processed_data"]["path"]
        data_file = data_folder / config["processed_data"]["filename"]
        if data_file.exists():
            self.data = pd.read_csv(data_file, sep=";")
        else:
            odf_data_loader = BaseLoader.loader_factory(config["url"], dtype=config["dtype"])
            odf_data = odf_data_loader.load()
            self.data = odf_data
            self.save(
                Path(config["processed_data"]["path"]), config["processed_data"]["filename"]
            )

    def get(self):
        return self.data

    def save(self, path, filename):
        save_csv(self.data, path, filename, sep=";", index=True)
