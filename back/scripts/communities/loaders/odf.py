import logging
from pathlib import Path
import pandas as pd

from back.scripts.utils.dataframe_operation import normalize_column_names
from scripts.utils.files_operation import save_csv
from scripts.loaders.base_loader import BaseLoader
from scripts.utils.config import get_project_base_path


class OdfLoader:
    """
    OdfLoader loads data from the ODF dataset and saves it to a CSV file.
    Data from OpenDataFrance, data.gouv.fr, 2022.
    This dataset lists the platforms and organizations that contribute to the development of open data in the territories, identified during the 2022 edition (as of December 31).

    TODO : Refactor using loaders_factory when loading from disk
    """

    def __init__(self, config):
        self._config = config
        self._logger = logging.getLogger(__name__)

    def get(self):
        processed_data_config = self._config["processed_data"]
        data_folder = get_project_base_path() / processed_data_config["path"]
        data_file = data_folder / processed_data_config["filename"]

        if data_file.exists():
            self._logger.info("Found ODF file on disk, loading it.")
            return pd.read_csv(data_file, sep=";")

        self._logger.info("Loading ODF data.")
        odf_data_loader = BaseLoader.loader_factory(
            self._config["url"], dtype=self._config["dtype"]
        )
        data = odf_data_loader.load()
        data = normalize_column_names(data)
        save_csv(
            data,
            Path(processed_data_config["path"]),
            processed_data_config["filename"],
            sep=";",
            index=True,
        )
        return data
