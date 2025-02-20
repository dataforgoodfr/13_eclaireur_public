import logging

import pandas as pd
from scripts.utils.config import get_project_data_path


class SingleUrlsBuilder:
    """
    This class is responsible for building the datafiles from the single_urls file, aka standalone files.
    It provides the same "get_datafiles" method as DataGouvSearcher class : their outputs are concatenated in the workflow_manager.py.
    """

    def __init__(self, communities_selector):
        self.logger = logging.getLogger(__name__)
        self.scope = communities_selector

    def get_datafiles(self, search_config):
        single_urls_source_file = (
            get_project_data_path()
            / "datasets"
            / "subventions"
            / "inputs"
            / search_config["single_urls_file"]
        )
        single_urls_files_in_scope = pd.read_csv(single_urls_source_file, sep=";")
        return single_urls_files_in_scope.merge(
            self.scope.selected_data[["siren", "nom", "type"]], on="siren", how="left"
        ).assign(source="single_url")
