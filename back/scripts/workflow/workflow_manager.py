import logging
from datetime import datetime
from pathlib import Path

import pandas as pd
from scripts.communities.communities_selector import CommunitiesSelector
from scripts.datasets.datafile_loader import DatafileLoader
from scripts.datasets.datafiles_loader import DatafilesLoader
from scripts.datasets.datagouv_searcher import DataGouvSearcher
from scripts.datasets.single_urls_builder import SingleUrlsBuilder
from scripts.utils.config import get_project_base_path, get_project_data_path
from scripts.utils.constants import (
    DATACOLUMNS_OUT_FILENAME,
    DATAFILES_OUT_FILENAME,
    FILES_IN_SCOPE_FILENAME,
    MODIFICATIONS_DATA_FILENAME,
    NORMALIZED_DATA_FILENAME,
)
from scripts.utils.files_operation import save_csv

from back.scripts.datasets.declaration_interet import DeclaInteretWorkflow
from back.scripts.utils.dataframe_operation import normalize_column_names
from back.scripts.utils.elected_officials import ElectedOfficialsWorkflow
from back.scripts.utils.psql_connector import PSQLConnector


class WorkflowManager:
    def __init__(self, args, config):
        self.args = args
        self.config = config
        self.logger = logging.getLogger(__name__)
        self.connector = PSQLConnector()

        self.source_folder = get_project_data_path()
        self.source_folder.mkdir(exist_ok=True, parents=True)

    def run_workflow(self):
        self.logger.info("Workflow started.")
        ElectedOfficialsWorkflow(self.config["elected_officials"]["data_folder"]).run()
        DeclaInteretWorkflow(
            self.config["declarations_interet"]["data_folder"],
            is_test=bool(self.config.get("is_test")),
        ).run()
        self._run_subvention_and_marche()

        self.logger.info("Workflow completed.")

    def _run_subvention_and_marche(self):
        df_to_save_to_db = {}

        # If communities files are already generated, check the age
        self.check_file_age(self.config["file_age_to_check"])

        communities_selector = self.initialize_communities_scope()

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

    def initialize_communities_scope(self):
        self.logger.info("Initializing communities scope.")
        # Initialize CommunitiesSelector with the config and select communities
        communities_selector = CommunitiesSelector(self.config["communities"])

        self.connector.save_df_to_sql_drop_existing(
            self.config["workflow"]["save_to_db"],
            communities_selector.selected_data,
            "selected_communities",
            index=True,
            index_label=["siren"],
        )

        self.logger.info("Communities scope initialized.")
        return communities_selector

    def process_topic(self, communities_selector, topic, topic_config):
        self.logger.info(f"Processing topic {topic}.")
        topic_files_in_scope = None

        if topic_config["source"] == "multiple":
            # Find multiple datafiles from datagouv
            config = self.config["datagouv"]
            config["datagouv_api"] = self.config["datagouv_api"]
            datagouv_searcher = DataGouvSearcher(communities_selector, config)
            datagouv_topic_files_in_scope = datagouv_searcher.select_datasets(topic_config)

            # Find single datafiles from single urls (standalone datasources outside of datagouv)
            single_urls_builder = SingleUrlsBuilder(communities_selector)
            single_urls_topic_files_in_scope = single_urls_builder.get_datafiles(topic_config)

            # Concatenate both datafiles lists into one
            topic_files_in_scope = pd.concat(
                [datagouv_topic_files_in_scope, single_urls_topic_files_in_scope],
                ignore_index=True,
            )

            self.connector.save_df_to_sql_drop_existing(
                self.config["workflow"]["save_to_db"],
                topic_files_in_scope,
                topic + "_files_in_scope",
                index=True,
                index_label=["url"],
            )

            # Process the datafiles list: download & normalize
            topic_datafiles = DatafilesLoader(
                topic_files_in_scope, topic, topic_config, self.config["datafile_loader"]
            )

            self.connector.save_df_to_sql_drop_existing(
                self.config["workflow"]["save_to_db"],
                topic_datafiles.normalized_data,
                topic + "_normalized_data",
                index=True,
                index_label=[
                    "idAttribuant",
                    "idBeneficiaire",
                    "dateConvention",
                    "referenceDecision",
                    "montant",
                    "idRAE",
                ],
            )

        elif topic_config["source"] == "single":
            # Process the single datafile: download & normalize
            topic_datafiles = DatafileLoader(communities_selector, topic_config)

            self.connector.save_df_to_sql_drop_existing(
                self.config["workflow"]["save_to_db"],
                topic_datafiles.normalized_data,
                topic + "_normalized_data",
                index=True,
                index_label=["id", "acheteur.id", "codeCPV"],
            )

        if self.config["workflow"]["save_to_db"]:
            self.connector.close_connection()

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
        output_folder = get_project_base_path() / (
            self.config["outputs_csv"]["path"] % {"topic": topic}
        )
        output_folder.mkdir(parents=True, exist_ok=True)
        normalized_data = normalize_column_names(normalized_data)

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
