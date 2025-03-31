import logging
import re
from pathlib import Path

import pandas as pd
from tqdm import tqdm

from back.scripts.datasets.datagouv_catalog import DataGouvCatalog
from back.scripts.utils.config import get_combined_filename, get_project_base_path
from back.scripts.utils.dataframe_operation import (
    sort_by_format_priorities,
)
from back.scripts.utils.datagouv_api import DataGouvAPI

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
        print(self.catalog)
        from_dataset_infos = self._select_datasets_by_title_and_desc()
        from_dataset_infos.to_parquet(self.get_output_path(self.main_config))
        print(from_dataset_infos)

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

    def _select_dataset_by_metadata(
        self,
        title_filter: list[str],
        description_filter: list[str],
        column_filter: list[str],
        test_ids: list[str],
    ) -> list[dict]:
        """
        Select datasets based on metadata fetched from data.gouv organisation page.
        """
        id_datagouvs_to_siren = self.communities[["siren", "id_datagouv"]]
        id_datagouvs_list = (
            sorted(id_datagouvs_to_siren["id_datagouv"].unique()) if not test_ids else test_ids
        )

        pattern_title = "|".join([x.lower() for x in title_filter])
        pattern_description = "|".join([x.lower() for x in description_filter])
        pattern_resources = "|".join([x.lower() for x in column_filter])

        datasets = (
            pd.concat(
                [
                    DataGouvAPI.organisation_datasets(
                        orga, self._config["datagouv_api"]["organization_folder"]
                    )
                    for orga in tqdm(id_datagouvs_list)
                ],
                ignore_index=True,
            )
            .assign(
                keyword_in_title=lambda df: df["title"]
                .str.lower()
                .str.contains(pattern_title, regex=True),
                keyword_in_description=lambda df: df["description"]
                .str.lower()
                .str.contains(pattern_description, regex=True),
                keyword_in_resource=lambda df: df["resource_description"]
                .str.lower()
                .str.contains(pattern_resources, regex=True)
                .fillna(False),
            )
            .pipe(lambda df: df[df["keyword_in_title"] | df["keyword_in_description"]])
        )

        # A dataset may have multiple available formats (resources)
        # Not all resources have the same info within metadata.
        # If we find an interesting property for a given format, we assume it should be the same
        # for all formats of this dataset.
        propagated_columns = (
            datasets.groupby("dataset_id")
            .agg({"keyword_in_resource": "max"})
            .pipe(lambda df: df[df["keyword_in_resource"]])
        )

        datasets = (
            pd.merge(
                datasets.drop(columns=["keyword_in_resource"]),
                propagated_columns,
                on="dataset_id",
            )
            .merge(
                id_datagouvs_to_siren,
                left_on="organization_id",
                right_on="id_datagouv",
            )
            .drop(columns=["id_datagouv", "organization_id"])
        )
        return datasets

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

    def select_datasets(self, search_config: dict, method: str = "all") -> pd.DataFrame:
        """
        Identify a set of datasets of interest with multiple methods.
        `td_only` identifies datasets based on keywords on their title or description.
        `bu_only` identifies datasets based on metadata from data.gouv api.
        `all` combines both methods.
        """
        if method not in ["all", "td_only", "bu_only"]:
            raise ValueError(
                f"Unknown Datafiles Searcher method {method} : should be one of ['td_only', 'bu_only', 'all']"
            )

        final_datasets_filename = self.data_folder / self._config["files"]["datasets"]
        if final_datasets_filename.exists():
            return pd.read_parquet(final_datasets_filename)

        catalog = self.initialize_catalog()
        metadata_catalog = self.initialize_catalog_metadata()[
            [
                "dataset_id",
                "format",
                "created_at",
                "url",
                "type_resource",
                "resource_status",
            ]
        ]
        datafiles = []
        if method in ["all", "td_only"]:
            topdown_datafiles = self._select_datasets_by_title_and_desc(
                catalog, search_config["title_filter"], search_config["description_filter"]
            ).merge(metadata_catalog, on="dataset_id")
            datafiles.append(topdown_datafiles)
            LOGGER.info("Topdown datafiles basic info :")
            self._log_basic_info(topdown_datafiles)

        if method in ["bu_only", "all"]:
            bottomup_datafiles = self._select_dataset_by_metadata(
                search_config["api"]["title"],
                search_config["api"]["description"],
                search_config["api"]["columns"],
                search_config["api"]["testIds"],
            )
            datafiles.append(bottomup_datafiles)
            LOGGER.info("Bottomup datafiles basic info :")
            self._log_basic_info(bottomup_datafiles)

        datafiles = (
            pd.concat(datafiles, ignore_index=False)
            .pipe(lambda df: df[~df["type_resource"].fillna("empty").isin(["documentation"])])
            .merge(self.communities[["siren", "nom", "type"]], on="siren", how="left")
            .assign(source="datagouv")
            .pipe(self._select_prefered_format)
        )
        LOGGER.info("Total datafiles basic info :")
        self._log_basic_info(datafiles)
        datafiles.to_parquet(final_datasets_filename)

        return datafiles


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
