import logging
import re
from pathlib import Path

import pandas as pd

from back.scripts.datasets.datagouv_catalog import DataGouvCatalog
from back.scripts.utils.config import get_combined_filename, get_project_base_path
from back.scripts.utils.dataframe_operation import sort_by_format_priorities

LOGGER = logging.getLogger(__name__)

DATAGOUV_PREFERED_FORMAT = ["parquet", "csv", "xls", "json", "zip"]


class DataGouvSearcher:
    """
    This class is responsible for searching datafiles on the data.gouv.fr API and datasets catalog.
    It initializes from a CommunitiesSelector object and a datagouv_config dictionary, to load the datasets and datafiles catalogs.
    It provides one public method get_datafiles(search_config, method) to build a list of datafiles based on title and description filters and column names filters.
    """

    @classmethod
    def get_config_key(cls) -> str:
        return "datagouv_search"

    @classmethod
    def get_output_path(cls, main_config: dict) -> Path:
        return get_combined_filename(main_config, cls.get_config_key())

    def __init__(self, main_config: dict):
        self.main_config = main_config
        self._config = main_config[self.get_config_key()]

        self.data_folder = get_project_base_path() / self._config["data_folder"]
        self.data_folder.mkdir(exist_ok=True, parents=True)

    def run(self):
        if self.get_output_path(self.main_config).exists():
            return
        self.catalog = pd.read_parquet(DataGouvCatalog.get_output_path(self.main_config))
        from_dataset_infos = (
            self._select_datasets_by_title_and_desc()
            .pipe(self._select_prefered_format)
            .pipe(remove_same_dataset_formats)
        )
        from_dataset_infos.to_parquet(self.get_output_path(self.main_config))

    def _select_datasets_by_title_and_desc(self) -> pd.DataFrame:
        """
        Identify datasets of interest from the catalog by looking for keywords in
        title and description.
        """
        description_pattern = re.compile("|".join(self._config["description_filter"]))
        flagged_by_description = (
            self.catalog["dataset.description"]
            .str.lower()
            .str.contains(description_pattern, na=False)
        )
        LOGGER.info(
            f"Nombre de datasets correspondant au filtre de description : {flagged_by_description.sum()}"
        )

        title_pattern = re.compile("|".join(self._config["title_filter"]))
        flagged_by_title = (
            self.catalog["dataset.title"].str.lower().str.contains(title_pattern, na=False)
        )
        LOGGER.info(
            f"Nombre de datasets correspondant au filtre de titre : {flagged_by_title.sum()}"
        )

        return self.catalog[flagged_by_title | flagged_by_description]

    def _select_prefered_format(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Datasets on data.gouv can be available in multiple formats.
        If multiple rows are present with the same `dataset_id`,
        we keep only the one with format with the most priority.
        """
        return (
            df.assign(
                priority=lambda df: df["format"]
                .map({n: i for i, n in enumerate(DATAGOUV_PREFERED_FORMAT)})
                .fillna(len(DATAGOUV_PREFERED_FORMAT))
            )
            .sort_values("priority")
            .drop_duplicates(subset=["url"], keep="first")
            .drop(columns=["priority"])
        )

    def _log_basic_info(self, df: pd.DataFrame):
        """
        Log basic info about a search result dataframe
        """
        LOGGER.info(
            f"Nombre de datasets correspondant au filtre de titre ou de description : {df['dataset_id'].nunique()}"
        )
        LOGGER.info(f"Nombre de fichiers : {df.shape[0]}")
        LOGGER.info(f"Nombre de fichiers uniques : {df['url'].nunique()}")
        LOGGER.info(f"Nombre de fichiers par format : {df.groupby('format').size().to_dict()}")
        LOGGER.info(
            f"Nombre de fichiers par fréquence : {df.groupby('frequency').size().to_dict()}"
        )


def remove_same_dataset_formats(df: pd.DataFrame) -> pd.DataFrame:
    """
    Identify from url different formats of the same dataset and only select the most useful format.

    Examples :
    - http://www.data.rennes-metropole.fr/fileadmin/user_upload/data/vdr_budget_v3/CA_2011_Open_DATA_Subventions_d_equipement.<FORMAT>
    - https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/subventions-aux-associations-votees-copie1/exports/(json|csv?use_labels=true)
    - https://data.grandpoitiers.fr/explore/dataset/citoyennete-subventions-directes-attribuees-aux-associations-2017-ville-de-poiti/download?format=<FORMAT>
    """
    fetch_base_url = {
        f: re.compile(r"^(.*)\b" + f + r"\b") for f in df["format"].dropna().unique()
    }
    base_url = [
        (fetch_base_url[row.format].match(row.url), row.url)
        if row.url and not pd.isna(row.format)
        else (None, row.url)
        for row in df.itertuples()
    ]
    base_url = [m.group(1) if m else url for m, url in base_url]

    return (
        df.assign(base_url=base_url)
        .pipe(sort_by_format_priorities, keep=True)
        .sort_values(["dataset_id", "base_url", "priority"])
        .drop_duplicates(subset=["dataset_id", "base_url"], keep="first")
        .drop(columns=["priority", "base_url"])
    )
