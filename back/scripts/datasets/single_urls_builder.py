import logging

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.utils.config import project_config
from back.scripts.utils.dataframe_operation import IdentifierFormat, normalize_identifiant

LOGGER = logging.getLogger(__name__)


class SingleUrlsBuilder:
    """
    This class is responsible for building the datafiles from the single_urls file, aka standalone files.
    It provides the same "get_datafiles" method as DataGouvSearcher class : their outputs are concatenated in the workflow_manager.py.
    """

    def __init__(self):
        self.scope = BaseLoader.loader_factory(
            CommunitiesSelector.get_output_path(project_config)
        ).load()

    def get_datafiles(self, search_config):
        single_urls_source_file = search_config["single_urls_file"]
        return (
            BaseLoader.loader_factory(single_urls_source_file)
            .load()
            .pipe(normalize_identifiant, id_col="siren", format=IdentifierFormat.SIREN)
            .merge(self.scope[["siren", "nom", "type"]], on="siren", how="left")
            .assign(source="single_url")
        )
