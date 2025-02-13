import json
import logging
from pathlib import Path

import pandas as pd
import requests
from scripts.loaders.csv_loader import CSVLoader


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
            self.dataset_catalog_df = pd.read_parquet(fn)
        else:
            dataset_catalog_loader = CSVLoader(
                self._config["datasets"]["url"],
                columns_to_keep=self._config["datasets"]["columns"],
            )
            self.dataset_catalog_df = (
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
            self.dataset_catalog_df.to_parquet(fn)

        fn = Path("catalog_file.parquet")
        if fn.exists():
            self.datafile_catalog_df = pd.read_parquet(fn)
        else:
            datafile_catalog_loader = CSVLoader(self._config["datafiles"]["url"])
            self.datafile_catalog_df = (
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
            self.datafile_catalog_df.to_parquet(fn)

    # Internal function to filter a dataframe by a column and one or multiple values
    def _filter_by(self, df, column, value, return_mask=False):
        # value can be a list of values or a string
        if isinstance(value, str):
            mask = df[column].str.contains(value, case=False, na=False)
        else:
            mask = df[column].isin(value)
        return mask if return_mask else df[mask]

    # Internal function to filter a dataframe by a column and one or multiple values
    def _get_datafiles_by_title_and_desc(self, title_filter, description_filter):
        # Get the datasets that match the title and description filters
        mask_desc = self._filter_by(
            self.dataset_catalog_df, "description", description_filter, return_mask=True
        )
        self.logger.info(
            f"Nombre de datasets correspondant au filtre de description : {mask_desc.sum()}"
        )

        mask_titles = self._filter_by(
            self.dataset_catalog_df, "title", title_filter, return_mask=True
        )
        self.logger.info(
            f"Nombre de datasets correspondant au filtre de titre : {mask_titles.sum()}"
        )

        # Merge the two masks and get the filtered datasets catalog
        filtered_catalog_df = self.dataset_catalog_df[(mask_titles | mask_desc)]

        # Merge with catalog files to get the filtered files list
        filtered_files = filtered_catalog_df[
            ["siren", "id", "title", "description", "organization", "frequency"]
        ].merge(
            self.datafile_catalog_df[["dataset.id", "format", "created_at", "url"]],
            left_on="id",
            right_on="dataset.id",
            how="left",
        )
        filtered_files.drop(columns=["dataset.id"], inplace=True)
        return filtered_files

    # Internal function to get the preferred format of a list of records
    def _get_preferred_format(self, records):
        preferred_formats = ["csv", "xls", "json", "zip"]  # Could be put outside

        for format in preferred_formats:
            for record in records:
                if record.get("format: ") == format:
                    return record

        for record in records:
            if record.get("format: ") is not None:
                return record

        return records[0] if records else None

    # Internal function to create a list of dictionaries, one for each file with the specified filters of one organization
    def _get_files_by_org_from_api(
        self, url, organization_id, title_filter, description_filter, column_filter
    ):
        params = {"organization": organization_id}
        scoped_files = []
        while True:
            response = requests.get(url, params=params)
            try:
                response.raise_for_status()
            except Exception as e:
                self.logger.error(f"Error while downloading file from {url} : {e}")
                break
            try:
                data = response.json()
            except json.JSONDecodeError as e:
                self.logger.error(f"Error while decoding json from {url} : {e}")
                break

            # Loop through the files list to filter them by title and description
            for result in data["data"]:
                files = []
                # Check if the title contains the title_filter words
                if any(word in result["title"].lower() for word in title_filter):
                    keyword_in_title = True
                else:
                    keyword_in_title = False

                # Check if the description contains the description_filter words
                if any(word in result["description"].lower() for word in description_filter):
                    keyword_in_description = True
                else:
                    keyword_in_description = False
                montant_col = None
                # Loop through the resources list to filter them by column names
                for resource in result["resources"]:
                    if resource["description"] is None:
                        montant_col = None
                    elif any(word in resource["description"].lower() for word in column_filter):
                        montant_col = True
                    else:
                        montant_col = False

                    # Add the file info to the files list if it matches the filters
                    files.append(
                        {
                            "organization_id": result["organization"]["id"],
                            "organization": result["organization"]["name"],
                            "title": result["title"],
                            "description": result["description"],
                            "id": result["id"],
                            "frequency": result["frequency"],
                            "format": resource["format"],
                            "url": resource["url"],
                            "created_at": resource["created_at"],
                            "montant_col": montant_col,
                            "keyword_in_description": keyword_in_description,
                            "keyword_in_title": keyword_in_title,
                        }
                    )
                # If either title, description or column name matches, add the file to the scoped_files list (check if format is in preferred formats)
                if (keyword_in_description or keyword_in_title or montant_col) and len(
                    files
                ) > 0:
                    scoped_files.append(self._get_preferred_format(files))

            # If there is a next page, update the url and params to get the next page
            if data["next_page"]:
                url = data["next_page"]
                params = {}
            else:
                break
        return scoped_files

    # Internal function to get a list of dictionaries with the files that match the filters
    def _get_datafiles_by_content(self, url, title_filter, description_filter, column_filter):
        all_files = []

        # Loop through the organizations to get a list of dictionaries with the files that match the filters
        for orga in self.datagouv_ids_list:
            cur_files = self._get_files_by_org_from_api(
                url, orga, title_filter, description_filter, column_filter
            )
            all_files = all_files + cur_files

        bottom_up_files_df = pd.DataFrame(all_files)
        # Join with siren based on organization
        bottom_up_files_df = bottom_up_files_df.merge(
            self.datagouv_ids_to_siren,
            left_on="organization_id",
            right_on="id_datagouv",
            how="left",
        )
        bottom_up_files_df.drop(columns=["id_datagouv"], inplace=True)
        bottom_up_files_df.drop(columns=["organization_id"], inplace=True)
        return bottom_up_files_df[
            (bottom_up_files_df.keyword_in_title | bottom_up_files_df.keyword_in_description)
            & bottom_up_files_df.montant_col
        ]

    # Internal function to log basic info about a search result dataframe
    def _log_basic_info(self, df):
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
            topdown_datafiles = self._get_datafiles_by_title_and_desc(
                search_config["title_filter"], search_config["description_filter"]
            )
            self.logger.info("Topdown datafiles basic info :")
            self._log_basic_info(topdown_datafiles)

        # Only using bottomup method: look for datafiles based on column names filters
        if not method == "td_only":
            bottomup_datafiles = self._get_datafiles_by_content(
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
