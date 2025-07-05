import logging
import re

import pandas as pd

from back.scripts.loaders.adapters.decoder import StreamDecoder
from back.scripts.loaders.adapters.reader import CsvReader
from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.loaders.data_loader import create_data_loader
from back.scripts.loaders.utils import register_loader

LOGGER = logging.getLogger(__name__)


@register_loader
class CSVLoader(BaseLoader):
    """
    Adapter class for loading CSV files.

    This class fits into the existing BaseLoader framework but delegates
    the actual loading process to a composition-based DataLoader, which
    is initialized with the class.

    We only use the factory and the config loading from the BaseLoader.
    """

    file_extensions = {"csv"}
    file_media_type_regex = re.compile(r"csv", flags=re.IGNORECASE)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        reader = CsvReader()
        decoder = StreamDecoder()
        self.data_loader = create_data_loader(self.file_url, reader=reader, decoder=decoder)

    def load(self, force: bool = True) -> pd.DataFrame:
        """
        Overrides the BaseLoader's load method to use the new compositional DataLoader.
        """
        if not self.file_url:
            raise RuntimeError("Empty file URL provided")

        if not force and not self.can_load_file(self.file_url):
            raise RuntimeError(f"File {self.file_url} is not supported by this loader")

        LOGGER.debug(f"Delegating loading of {self.file_url} to composition-based DataLoader.")

        return self.data_loader.load(self.file_url, **self.kwargs)
