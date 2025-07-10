import logging
from copy import deepcopy
from datetime import datetime
from pathlib import Path

import pandas as pd

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.communities.loaders.ofgl import OfglLoader
from back.scripts.datasets.communities_contacts import CommunitiesContact
from back.scripts.datasets.communities_financial_accounts import FinancialAccounts
from back.scripts.datasets.cpv_labels import CPVLabelsWorkflow
from back.scripts.datasets.datagouv_catalog import DataGouvCatalog
from back.scripts.datasets.datagouv_searcher import (
    DataGouvSearcher,
    remove_same_dataset_formats,
)
from back.scripts.datasets.declaration_interet import DeclaInteretWorkflow
from back.scripts.datasets.elected_officials import ElectedOfficialsWorkflow
from back.scripts.datasets.marches import MarchesPublicsWorkflow
from back.scripts.datasets.single_urls_builder import SingleUrlsBuilder
from back.scripts.datasets.sirene import SireneWorkflow
from back.scripts.datasets.topic_aggregator import TopicAggregator
from back.scripts.utils.dataframe_operation import (
    clean_file_format,
    correct_format_from_url,
    sort_by_format_priorities,
)
from back.scripts.utils.datagouv_api import select_implemented_formats


class WorkflowManager:
    """
    This class manages the download and formatting of the different datasets in the project.
    Each concept will have its own workflow, represented by a class, which will generate a single parquet file.
    This final output may be a composite of multiple input files.

    A concept workflow may be dependent on another one.
    This dependency is only visible within the worflow by using the output file name method from the classes the worflow depends on.
    """

    def __init__(self, args, config):
        self.args = args
        self.config = config
        self.logger = logging.getLogger(__name__)

    def get_workflows(self) -> list:
        return [
            CPVLabelsWorkflow,
            SireneWorkflow,
            FinancialAccounts,
            ElectedOfficialsWorkflow.from_config,
            DeclaInteretWorkflow,
            OfglLoader.from_config,
            CommunitiesSelector,
            DataGouvCatalog,
            MarchesPublicsWorkflow.from_config,
            DataGouvSearcher,
            CommunitiesContact,
        ]

    def run_workflow(self) -> None:
        self.logger.info("Workflow started.")

        for workflow in self.get_workflows():
            try:
                workflow(deepcopy(self.config)).run()
            except Exception as e:
                self.logger.error(
                    f"An error occurred while running the workflow {workflow.__name__}: {e}"
                )
                continue

        self.process_subvention("subventions", self.config["search"]["subventions"])

        self.logger.info("Workflow completed.")

    def check_file_age(self, config: dict) -> None:
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

    def process_subvention(self, topic: str, topic_config: dict) -> None:
        self.logger.info(f"Processing subvention {topic}.")
        topic_files_in_scope = None

        datagouv_topic_files_in_scope = pd.read_parquet(
            DataGouvSearcher.get_output_path(self.config)
        )

        # Find single datafiles from single urls (standalone datasources outside of datagouv)
        single_urls_builder = SingleUrlsBuilder()
        single_urls_topic_files_in_scope = single_urls_builder.get_datafiles(topic_config)
        # Concatenate both datafiles lists into one
        topic_files_in_scope = (
            pd.concat(
                [datagouv_topic_files_in_scope, single_urls_topic_files_in_scope],
                ignore_index=True,
            )
            .dropna(subset=["url"])
            .pipe(correct_format_from_url)
            .pipe(drop_grenoble_duplicates)
            .pipe(clean_file_format)
            .pipe(sort_by_format_priorities)
            .drop_duplicates(subset=["url"], keep="first")
            .pipe(remove_same_dataset_formats)
            .pipe(select_implemented_formats)
        )

        topic_agg = TopicAggregator(topic_files_in_scope, topic, self.config["datafile_loader"])
        topic_agg.run()


def drop_grenoble_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """
    Grenoble agglomeration has one different resource id for the same year for each daily deposit.
    """
    mask = (df["id_datagouv"] == "5732ff7788ee382b08d1b934") & df.duplicated(
        subset=["title", "id_datagouv"], keep="last"
    )
    return df[~mask]
