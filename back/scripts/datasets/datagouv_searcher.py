import itertools
import json
import logging
from pathlib import Path

import pandas as pd
import requests
from scripts.loaders.csv_loader import CSVLoader
from tqdm import tqdm


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
        self.initialize_catalogs()

    def initialize_catalogs(self):
        """
        Create a catalog
        """
        self.datagouv_ids_to_siren = self.scope.get_datagouv_ids()
        datagouv_ids_list = list(self.datagouv_ids_to_siren["id_datagouv"].unique())

        fn = Path("catalog.parquet")
        if fn.exists():
            self.datasets_catalog = pd.read_parquet(fn)
        else:
            dataset_catalog_loader = CSVLoader(
                self._config["datasets"]["url"],
                columns_to_keep=self._config["datasets"]["columns"],
            )
            self.datasets_catalog = (
                dataset_catalog_loader.load()
                .pipe(lambda df: df[df["organization_id"].isin(datagouv_ids_list)])
                .merge(
                    self.datagouv_ids_to_siren,
                    left_on="organization_id",
                    right_on="id_datagouv",
                    how="left",
                )
                .drop(columns=["id_datagouv"])
            )
            self.datasets_catalog.to_parquet(fn)

        fn = Path("catalog_file.parquet")
        if fn.exists():
            self.datasets_metadata = pd.read_parquet(fn)
        else:
            datafile_catalog_loader = CSVLoader(self._config["datafiles"]["url"])
            self.datasets_metadata = (
                datafile_catalog_loader.load()
                .rename(columns={"dataset.organization_id": "organization_id"})
                .pipe(lambda df: df[df["organization_id"].isin(datagouv_ids_list)])
                .merge(
                    self.datagouv_ids_to_siren,
                    left_on="organization_id",
                    right_on="id_datagouv",
                    how="left",
                )
                .drop(columns=["id_datagouv"])
            )
            self.datasets_metadata.to_parquet(fn)

    # Internal function to filter a dataframe by a column and one or multiple values
    def _filter_by(self, df, column, value, return_mask=False):
        # value can be a list of values or a string
        if isinstance(value, str):
            mask = df[column].str.contains(value, case=False, na=False)
        else:
            mask = df[column].isin(value)
        return mask if return_mask else df[mask]

    def _select_datasets_by_title_and_desc(self, title_filter, description_filter):
        """
        Identify datasets of interest from the catalog by looking for keywords in
        title and description.
        """
        flagged_by_description = self.datasets_catalog["description"].str.contains(
            description_filter, case=False, na=False
        )
        self.logger.info(
            f"Nombre de datasets correspondant au filtre de description : {flagged_by_description.sum()}"
        )

        flagged_by_title = self.datasets_catalog["title"].str.contains(
            title_filter, case=False, na=False
        )
        self.logger.info(
            f"Nombre de datasets correspondant au filtre de titre : {flagged_by_title.sum()}"
        )

        return (
            self.datasets_catalog.loc[
                (flagged_by_title | flagged_by_description),
                ["siren", "id", "title", "description", "organization", "frequency"],
            ]
            .merge(
                self.datasets_metadata[["dataset.id", "format", "created_at", "url"]],
                left_on="id",
                right_on="dataset.id",
                how="left",
            )
            .drop(columns=["dataset.id"])
        )

    def _get_preferred_format(self, records):
        """
        Select the prefered format from all posibilities of the same dataset.
        """
        preferred_formats = ["csv", "xls", "json", "zip"]

        for format in preferred_formats:
            for record in records:
                if record.get("format: ") == format:
                    return record

        for record in records:
            if record.get("format: ") is not None:
                return record

        return records[0] if records else None

    def _organization_datasets(self, url, organization_id):
        """
        List all datasets under an organization through data.gouv API.
        """
        params = {"organization": organization_id}
        response = requests.get(url, params=params)
        try:
            response.raise_for_status()
        except Exception as e:
            self.logger.error(f"Error while downloading file from {url} : {e}")
            return
        try:
            data = response.json()
        except json.JSONDecodeError as e:
            self.logger.error(f"Error while decoding json from {url} : {e}")
            return
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
            orga_datasets, next_url = self._organization_datasets(url, organization_id)

            for metadata in orga_datasets:
                keyword_in_title = any(
                    word in metadata["title"].lower() for word in title_filter
                )
                keyword_in_description = any(
                    word in metadata["description"].lower() for word in description_filter
                )

                montant_col = any(
                    word in (resource["description"] or "").lower()
                    for word in column_filter
                    for resource in metadata["resources"]
                )
                flagged_resources = [
                    {
                        "organization_id": metadata["organization"]["id"],
                        "organization": metadata["organization"]["name"],
                        "title": metadata["title"],
                        "description": metadata["description"],
                        "id": metadata["id"],
                        "frequency": metadata["frequency"],
                        "format": resource["format"],
                        "url": resource["url"],
                        "created_at": resource["created_at"],
                        "montant_col": montant_col,
                        "keyword_in_description": keyword_in_description,
                        "keyword_in_title": keyword_in_title,
                    }
                    for resource in metadata["resources"]
                    if (keyword_in_description or keyword_in_title or montant_col)
                ]
                prefered_resource = self._get_preferred_format(flagged_resources)
                if prefered_resource:
                    scoped_files.append(prefered_resource)

            if next_url:
                url = next_url
        return scoped_files

    def _select_dataset_by_content(
        self,
        url: str,
        title_filter: list[str],
        description_filter: list[str],
        column_filter: list[str],
    ) -> list[dict]:
        """
        Select datasets based on metadata fetched from data.gouv organisation page.
        """
        datagouv_ids_list = sorted(self.datagouv_ids_to_siren["id_datagouv"].unique())
        bottom_up_files_df = (
            pd.DataFrame(
                itertools.chain(
                    *[
                        self._get_files_by_org_from_api(
                            url, orga, title_filter, description_filter, column_filter
                        )
                        for orga in tqdm(datagouv_ids_list)
                    ]
                )
            )
            .merge(
                self.datagouv_ids_to_siren,
                left_on="organization_id",
                right_on="id_datagouv",
                how="left",
            )
            .drop(columns=["id_datagouv", "organization_id"])
        )
        return bottom_up_files_df[
            (bottom_up_files_df.keyword_in_title | bottom_up_files_df.keyword_in_description)
            & bottom_up_files_df.montant_col
        ]

    def _log_basic_info(self, df: pd.DataFrame):
        """
        Log basic info about a search result dataframe
        """
        self.logger.info(
            f"Nombre de datasets correspondant au filtre de titre ou de description : {df.id.nunique()}"
        )
        self.logger.info(f"Nombre de fichiers : {df.shape[0]}")
        self.logger.info(f"Nombre de fichiers uniques : {df.url.nunique()}")
        self.logger.info(
            f"Nombre de fichiers par format : {df.groupby('format').size().to_dict()}"
        )
        self.logger.info(
            f"Nombre de fichiers par fréquence : {df.groupby('frequency').size().to_dict()}"
        )

    # Function to get datafiles list selected by title and description filters and column names filters
    def get_datafiles(self, search_config, method="all"):
        import pdb

        pdb.set_trace()
        # Only using topdown method: look for datafiles based on title and description filters
        if not method == "bu_only":
            topdown_datafiles = self._select_datasets_by_title_and_desc(
                search_config["title_filter"], search_config["description_filter"]
            )
            self.logger.info("Topdown datafiles basic info :")
            self._log_basic_info(topdown_datafiles)

        # Only using bottomup method: look for datafiles based on column names filters
        if not method == "td_only":
            bottomup_datafiles = self._select_dataset_by_content(
                search_config["api"]["url"],
                search_config["api"]["title"],
                search_config["api"]["description"],
                search_config["api"]["columns"],
            )
            self.logger.info("Bottomup datafiles basic info :")
            self._log_basic_info(bottomup_datafiles)

        if method == "td_only":
            datafiles = topdown_datafiles
        elif method == "bu_only":
            datafiles = bottomup_datafiles
        elif method == "all":
            # Merge topdown and bottomup: bottomup has 3 additional columns that must be dropped
            datafiles = pd.concat([topdown_datafiles, bottomup_datafiles], ignore_index=False)
            datafiles.drop_duplicates(
                subset=["url"], inplace=True
            )  # Drop duplicates based on url
            self.logger.info("Total datafiles basic info :")
            self._log_basic_info(datafiles)
        else:
            raise ValueError(
                f"Unknown Datafiles Searcher method {method} : should be one of ['td_only', 'bu_only', 'all']"
            )

        # Add 'nom' & 'type' columns to datafiles from self.scope.selected_data based on siren
        datafiles = datafiles.merge(
            self.scope.selected_data[["siren", "nom", "type"]], on="siren", how="left"
        )
        # Add new 'source' column, filled with 'datagouv' value
        datafiles["source"] = "datagouv"

        return datafiles
