import itertools
import json
import logging
from typing import Tuple

import pandas as pd
from scripts.loaders.csv_loader import CSVLoader
from tqdm import tqdm

from back.scripts.loaders.base_loader import retry_session
from back.scripts.utils.config import get_project_base_path

DATAGOUV_PREFERED_FORMAT = ["csv", "xls", "json", "zip"]


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
        self.data_folder = get_project_base_path() / "data" / "datagouv_search"
        self.data_folder.mkdir(parents=True, exist_ok=True)

    def initialize_catalog(self):
        """
        Load or create the data.gouv dataset catalog and metadata catalog.
        """

        catalog_filename = self.data_folder / "datagouv_catalog.parquet"
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
        catalog_metadata_filename = self.data_folder / "catalog_metadata.parquet"
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
            .rename(columns={"dataset.id": "dataset_id"})
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

    def _get_preferred_format(self, records: list[dict]) -> dict:
        """
        Select the prefered format from all posibilities of the same dataset.
        """

        for format in DATAGOUV_PREFERED_FORMAT:
            for record in records:
                if record.get("format: ") == format:
                    return record

        for record in records:
            if record.get("format: ") is not None:
                logging.info("Unclassified file format " + record.get("format: "))
                return record

        return records[0] if records else None

    def _get_organization_datasets_page(
        self, url: str, organization_id: str
    ) -> Tuple[dict, str]:
        """
        List all datasets under an organization through data.gouv API.
        """
        session = retry_session(retries=5)
        params = {"organization": organization_id}
        response = session.get(url, params=params)
        try:
            response.raise_for_status()
        except Exception as e:
            self.logger.error(f"Error while downloading file from {url} : {e}")
            return [], None
        try:
            data = response.json()
        except json.JSONDecodeError as e:
            self.logger.error(f"Error while decoding json from {url} : {e}")
            return [], None
        return data["data"], data.get("next_page")

    def _get_files_by_org_from_api(
        self,
        url: str,
        organization_id: str,
        title_filter: list[str],
        description_filter: list[str],
        column_filter: list[str],
    ) -> list[dict]:
        """Return a list of dictionaries, one for each file with the specified filters of one organization."""

        scoped_files = []
        while url:
            orga_datasets, url = self._get_organization_datasets_page(url, organization_id)

            for metadata in orga_datasets:
                keyword_in_title = any(
                    word in metadata["title"].lower() for word in title_filter
                )
                keyword_in_description = any(
                    word in metadata["description"].lower() for word in description_filter
                )

                keyword_in_resources = any(
                    word in (resource["description"] or "").lower()
                    for word in column_filter
                    for resource in metadata["resources"]
                )
                flagged_resources = []
                if keyword_in_description or keyword_in_title or keyword_in_resources:
                    flagged_resources = [
                        {
                            "organization_id": metadata["organization"]["id"],
                            "organization": metadata["organization"]["name"],
                            "title": metadata["title"],
                            "description": metadata["description"],
                            "dataset_id": metadata["id"],
                            "frequency": metadata["frequency"],
                            "format": resource["format"],
                            "url": resource["url"],
                            "created_at": resource["created_at"],
                            "keyword_in_resource": keyword_in_resources,
                            "keyword_in_description": keyword_in_description,
                            "keyword_in_title": keyword_in_title,
                        }
                        for resource in metadata["resources"]
                    ]
                prefered_resource = self._get_preferred_format(flagged_resources)
                if prefered_resource:
                    scoped_files.append(prefered_resource)

        return scoped_files

    def _select_dataset_by_metadata(
        self,
        url: str,
        title_filter: list[str],
        description_filter: list[str],
        column_filter: list[str],
    ) -> list[dict]:
        """
        Select datasets based on metadata fetched from data.gouv organisation page.
        """
        datagouv_ids_to_siren = self.scope.get_datagouv_ids_to_siren()
        datagouv_ids_list = sorted(datagouv_ids_to_siren["id_datagouv"].unique())
        return (
            pd.DataFrame(
                itertools.chain(
                    *[
                        self._get_files_by_org_from_api(
                            url, orga, title_filter, description_filter, column_filter
                        )
                        for orga in tqdm(datagouv_ids_list[-5:])
                    ]
                ),
                columns=[
                    "organization_id",
                    "organization",
                    "title",
                    "description",
                    "dataset_id",
                    "frequency",
                    "format",
                    "url",
                    "created_at",
                    "keyword_in_resource",
                    "keyword_in_description",
                    "keyword_in_title",
                ],
            )
            .merge(
                datagouv_ids_to_siren,
                left_on="organization_id",
                right_on="id_datagouv",
                how="left",
            )
            .drop(columns=["id_datagouv", "organization_id"])
            .pipe(
                lambda df: df[
                    (df["keyword_in_title"] | df["keyword_in_description"])
                    & df["keyword_in_resource"]
                ]
            )
        )

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

        final_datasets_filenname = self.data_folder / "datagouv_datasets.parquet"
        if final_datasets_filenname.exists():
            return pd.read_parquet(final_datasets_filenname)

        catalog = self.initialize_catalog()
        metadata_catalog = self.initialize_catalog_metadata()
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
                search_config["api"]["url"],
                search_config["api"]["title"],
                search_config["api"]["description"],
                search_config["api"]["columns"],
            )
            datafiles.append(bottomup_datafiles)
            self.logger.info("Bottomup datafiles basic info :")
            self._log_basic_info(bottomup_datafiles)

        datafiles = (
            pd.concat(datafiles, ignore_index=False)
            .drop_duplicates(subset=["url"])
            .merge(self.scope.selected_data[["siren", "nom", "type"]], on="siren", how="left")
            .assign(source="datagouv")
        )
        self.logger.info("Total datafiles basic info :")
        self._log_basic_info(datafiles)
        datafiles.to_parquet(final_datasets_filenname)

        return datafiles
