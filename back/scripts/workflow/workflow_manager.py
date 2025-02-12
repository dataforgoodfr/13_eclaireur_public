from datetime import datetime
import logging
from pathlib import Path
import pandas as pd

from scripts.communities.communities_selector import CommunitiesSelector
from scripts.datasets.datagouv_searcher import DataGouvSearcher
from scripts.datasets.single_urls_builder import SingleUrlsBuilder
from scripts.datasets.datafiles_loader import DatafilesLoader
from scripts.datasets.datafile_loader import DatafileLoader
from scripts.utils.psql_connector import PSQLConnector
from scripts.utils.config import get_project_base_path
from scripts.utils.files_operation import save_csv
from scripts.utils.constants import (
    FILES_IN_SCOPE_FILENAME,
    NORMALIZED_DATA_FILENAME,
    DATAFILES_OUT_FILENAME,
    DATACOLUMNS_OUT_FILENAME,
    MODIFICATIONS_DATA_FILENAME,
)


class WorkflowManager:
    def __init__(self, args, config):
        self.args = args
        self.config = config
        self.logger = logging.getLogger(__name__)

    def run_workflow(self):
        self.logger.info("Workflow started.")
        # Create blank dict to store dataframes that will be saved to the DB
        df_to_save_to_db = {}

        # If communities files are already generated, check the age
        self.check_file_age(self.config["file_age_to_check"])

        # Build communities scope, and add selected communities to df_to_save
        communities_selector = self.initialize_communities_scope(df_to_save_to_db)

        # Loop through the topics defined in the config, e.g. marches publics or subventions.
        for topic, topic_config in self.config["search"].items():
            # Process each topic to get files in scope and datafiles
            topic_files_in_scope, topic_datafiles = self.process_topic(
                communities_selector, topic, topic_config
            )

            # Save the topics outputs to csv
            self.save_output_to_csv(
                topic,
                topic_datafiles.normalized_data,
                topic_files_in_scope,
                getattr(topic_datafiles, "datacolumns_out", None),
                getattr(topic_datafiles, "datafiles_out", None),
                getattr(topic_datafiles, "modifications_data", None),
            )
            # If config requires it, add normalized data of the topic to df_to_save
            if self.config["workflow"]["save_to_db"]:
                df_to_save_to_db[topic + "_normalized"] = topic_datafiles.normalized_data

        # Save data to the database if the config allows it
        if self.config["workflow"]["save_to_db"]:
            self.save_data_to_db(df_to_save_to_db)

        self.logger.info("Workflow completed.")

    def check_file_age(self, config):
        """
        Check file age and log a warning if file is too aged according to config.yaml file, section: file_age_to_check
        """
        max_age_in_days = config["age"]

        for filename, filepath in config["files"].items():
            if Path(filepath).exists():
                filepath = Path(filepath)
                last_modified = datetime.fromtimestamp(filepath.stat().st_mtime)
                age_in_days = (datetime.now() - last_modified).days
                self.logger.info(
                    f"Found: {filename} at {filepath}, last update: {last_modified}, age: {age_in_days} days"
                )

                if age_in_days > max_age_in_days:
                    self.logger.warning(
                        f"{filename} file is older than {max_age_in_days} days. It is advised to refresh your data."
                    )

    def initialize_communities_scope(self, df_to_save_to_db):
        self.logger.info("Initializing communities scope.")
        # Initialize CommunitiesSelector with the config and select communities
        communities_selector = CommunitiesSelector(self.config["communities"])

        # Add selected communities data to df_to_save
        if self.config["workflow"]["save_to_db"]:
            df_to_save_to_db["communities"] = communities_selector.selected_data

        self.logger.info("Communities scope initialized.")
        return communities_selector

    def process_topic(self, communities_selector, topic, topic_config):
        self.logger.info(f"Processing topic {topic}.")
        topic_files_in_scope = None

        if topic_config["source"] == "multiple":
            # Find multiple datafiles from datagouv
            datagouv_searcher = DataGouvSearcher(communities_selector, self.config["datagouv"])
            datagouv_topic_files_in_scope = datagouv_searcher.get_datafiles(topic_config)

            # Find single datafiles from single urls (standalone datasources outside of datagouv)
            single_urls_builder = SingleUrlsBuilder(communities_selector)
            single_urls_topic_files_in_scope = single_urls_builder.get_datafiles(topic_config)

            # Concatenate both datafiles lists into one
            topic_files_in_scope = pd.concat(
                [datagouv_topic_files_in_scope, single_urls_topic_files_in_scope],
                ignore_index=True,
            )

            # Process the datafiles list: download & normalize
            topic_datafiles = DatafilesLoader(
                topic_files_in_scope, topic, topic_config, self.config["datafile_loader"]
            )

        elif topic_config["source"] == "single":
            # Process the single datafile: download & normalize
            topic_datafiles = DatafileLoader(communities_selector, topic_config)

        self.logger.info(f"Topic {topic} processed.")
        return topic_files_in_scope, topic_datafiles

    def save_output_to_csv(
        self,
        topic,
        normalized_data,
        topic_files_in_scope=None,
        datacolumns_out=None,
        datafiles_out=None,
        modifications_data=None,
    ):
        # Define the output folder path
        output_folder = (
            Path(get_project_base_path()) / "back" / "data" / "datasets" / topic / "outputs"
        )

        # Loop through the dataframes (if not None) to save them to the output folder
        if normalized_data is not None:
            save_csv(normalized_data, output_folder, NORMALIZED_DATA_FILENAME, sep=";")
        if topic_files_in_scope is not None:
            save_csv(topic_files_in_scope, output_folder, FILES_IN_SCOPE_FILENAME, sep=";")
        if datacolumns_out is not None:
            save_csv(datacolumns_out, output_folder, DATACOLUMNS_OUT_FILENAME, sep=";")
        if datafiles_out is not None:
            save_csv(datafiles_out, output_folder, DATAFILES_OUT_FILENAME, sep=";")
        if modifications_data is not None:
            save_csv(modifications_data, output_folder, MODIFICATIONS_DATA_FILENAME, sep=";")

    def save_data_to_db(self, df_to_save_to_db):
        self.logger.info("Saving data to the database.")
        # Initialize the database connector
        connector = PSQLConnector()
        connector.connect()
        # Save each dataframe to the database
        for df_name, df in df_to_save_to_db.items():
            connector.save_df_to_sql(df, df_name)
