import logging
import re

import pandas as pd
import polars as pl

from back.scripts.adapters.loaders.decoder import StreamDecoder
from back.scripts.adapters.loaders.polar_reader import PolarCsvReader
from back.scripts.adapters.loaders.reader import CsvReader
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
        polar_reader = PolarCsvReader()
        self.data_loader = create_data_loader(
            self.file_url, reader=reader, decoder=decoder, polar_reader=polar_reader
        )

    def load(self, force: bool = True) -> pd.DataFrame | None:
        """
        Overrides the BaseLoader's load method to use the new compositional DataLoader.
        """
        if not self.file_url:
            raise RuntimeError("Empty file URL provided")

        if not force and not self.can_load_file(self.file_url):
            raise RuntimeError(f"File {self.file_url} is not supported by this loader")

        LOGGER.debug(f"Delegating loading of {self.file_url} to composition-based DataLoader.")

        try:
            return self.data_loader.load(self.file_url, **self.kwargs)
        except FileNotFoundError:
            return None
        except Exception as e:
            raise RuntimeError(f"Failed to load data from {self.file_url}") from e

    def load_lazy(self) -> pl.LazyFrame | None:
        return self.data_loader.load_lazy(self.file_url, **self.kwargs)
