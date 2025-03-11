import logging

import pandas as pd
from scripts.loaders.csv_loader import CSVLoader
from tqdm import tqdm

from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.dataframe_operation import expand_json_columns
from back.scripts.utils.datagouv_api import DataGouvAPI

DATAGOUV_PREFERED_FORMAT = ["parquet", "csv", "xls", "json", "zip"]


class DataGouvSearcher:
    """
    This class is responsible for searching datafiles on the data.gouv.fr API and datasets catalog.
    It initializes from a CommunitiesSelector object and a datagouv_config dictionary, to load the datasets and datafiles catalogs.
    It provides one public method get_datafiles(search_config, method) to build a list of datafiles based on title and description filters and column names filters.
    """

    def __init__(self, communities_selector, datagouv_config):
        self.logger = logging.getLogger(__name__)

        self._config = datagouv_config
        self.scope = communities_selector
        self.data_folder = get_project_base_path() / self._config["paths"]["root"]
        self.organization_data_folder = (
            self.data_folder / self._config["paths"]["organization_datasets"]
        )

        self.organization_data_folder.mkdir(parents=True, exist_ok=True)

    def initialize_catalog(self):
        """
        Load or create the data.gouv dataset catalog and metadata catalog.
        """

        catalog_filename = self.data_folder / self._config["files"]["catalog"]
        if catalog_filename.exists():
            return pd.read_parquet(catalog_filename)

        datagouv_ids_to_siren = self.scope.get_datagouv_ids_to_siren()
        dataset_catalog_loader = CSVLoader(
            self._config["datasets"]["url"],
            columns_to_keep=self._config["datasets"]["columns"],
        )
        datasets_catalog = (
            dataset_catalog_loader.load()
            .rename(columns={"id": "dataset_id"})
            .merge(
                datagouv_ids_to_siren,
                left_on="organization_id",
                right_on="id_datagouv",
            )
            .drop(columns=["id_datagouv"])
        )
        datasets_catalog.to_parquet(catalog_filename)
        return datasets_catalog

    def initialize_catalog_metadata(self):
        catalog_metadata_filename = self.data_folder / self._config["files"]["catalog_metadata"]
        if catalog_metadata_filename.exists():
            return pd.read_parquet(catalog_metadata_filename)

        datagouv_ids_to_siren = self.scope.get_datagouv_ids_to_siren()
        datafile_catalog_loader = CSVLoader(self._config["datafiles"]["url"])
        datasets_metadata = (
            datafile_catalog_loader.load()
            .rename(columns={"dataset.organization_id": "organization_id", "id": "metadata_id"})
            .merge(
                datagouv_ids_to_siren,
                left_on="organization_id",
                right_on="id_datagouv",
            )
            .drop(columns=["id_datagouv"])
            .pipe(expand_json_columns, column="extras")
            .rename(
                columns={
                    "dataset.id": "dataset_id",
                    "type": "type_resource",
                    "extras_check:status": "resource_status",
                }
            )
            # This line is necessary in case of absence of check:status in all jsons.
            .assign(resource_status=lambda df: df.get("resource_status", -1))
            .fillna({"resource_status": -1})
            .astype({"resource_status": "int16"})
        )
        datasets_metadata.to_parquet(catalog_metadata_filename)
        return datasets_metadata

    def _select_datasets_by_title_and_desc(
        self, catalog: pd.DataFrame, title_filter: str, description_filter: str
    ) -> pd.DataFrame:
        """
        Identify datasets of interest from the catalog by looking for keywords in
        title and description.
        """
        flagged_by_description = catalog["description"].str.contains(
            description_filter, case=False, na=False
        )
        self.logger.info(
            f"Nombre de datasets correspondant au filtre de description : {flagged_by_description.sum()}"
        )

        flagged_by_title = catalog["title"].str.contains(title_filter, case=False, na=False)
        self.logger.info(
            f"Nombre de datasets correspondant au filtre de titre : {flagged_by_title.sum()}"
        )

        return catalog.loc[
            (flagged_by_title | flagged_by_description),
            ["siren", "dataset_id", "title", "description", "organization", "frequency"],
        ]

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
        datagouv_ids_to_siren = self.scope.get_datagouv_ids_to_siren()
        datagouv_ids_list = (
            sorted(datagouv_ids_to_siren["id_datagouv"].unique()) if not test_ids else test_ids
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
                    for orga in tqdm(datagouv_ids_list)
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
                datagouv_ids_to_siren,
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
        self.logger.info(
            f"Nombre de datasets correspondant au filtre de titre ou de description : {df['dataset_id'].nunique()}"
        )
        self.logger.info(f"Nombre de fichiers : {df.shape[0]}")
        self.logger.info(f"Nombre de fichiers uniques : {df['url'].nunique()}")
        self.logger.info(
            f"Nombre de fichiers par format : {df.groupby('format').size().to_dict()}"
        )
        self.logger.info(
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
            self.logger.info("Topdown datafiles basic info :")
            self._log_basic_info(topdown_datafiles)

        if method in ["bu_only", "all"]:
            bottomup_datafiles = self._select_dataset_by_metadata(
                search_config["api"]["title"],
                search_config["api"]["description"],
                search_config["api"]["columns"],
                search_config["api"]["testIds"],
            )
            datafiles.append(bottomup_datafiles)
            self.logger.info("Bottomup datafiles basic info :")
            self._log_basic_info(bottomup_datafiles)

        datafiles = (
            pd.concat(datafiles, ignore_index=False)
            .pipe(lambda df: df[~df["type_resource"].fillna("empty").isin(["documentation"])])
            .merge(self.scope.selected_data[["siren", "nom", "type"]], on="siren", how="left")
            .assign(source="datagouv")
            .pipe(self._select_prefered_format)
        )
        self.logger.info("Total datafiles basic info :")
        self._log_basic_info(datafiles)
        datafiles.to_parquet(final_datasets_filename)

        return datafiles
