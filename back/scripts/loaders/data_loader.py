import logging
from typing import IO
from urllib.parse import urlparse

import pandas as pd

from back.scripts.adapters.loaders.fetcher import HttpFetcher, LocalFetcher
from back.scripts.interfaces.loader import IDecoder, IFetcher, IReader

LOGGER = logging.getLogger(__name__)


class DataLoader:
    """
    Orchestrates the data loading process using a fetcher, decoder, and reader.
    """

    def __init__(self, fetcher: IFetcher, reader: IReader, decoder: IDecoder | None = None):
        self.fetcher = fetcher
        self.reader = reader
        self.decoder = decoder

    def load(self, uri: str, **kwargs) -> pd.DataFrame:
        LOGGER.debug(f"Loading data from: {uri}")
        try:
            with self.fetcher.fetch(uri) as byte_stream:
                stream: IO = byte_stream
                if self.decoder:
                    stream = self.decoder.decode(byte_stream)

                return self.reader.read(stream, **kwargs)
        except Exception as e:
            LOGGER.error(f"Failed to load data from {uri}: {e}")
            return pd.DataFrame()


def create_data_loader(
    uri: str, reader: IReader, decoder: IDecoder | None = None
) -> DataLoader:
    """
    Factory function to create a DataLoader with the appropriate fetcher.
    """
    is_url = urlparse(uri).scheme.startswith("http")
    fetcher = HttpFetcher() if is_url else LocalFetcher()
    return DataLoader(fetcher=fetcher, reader=reader, decoder=decoder)
