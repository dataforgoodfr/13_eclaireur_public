import logging
from typing import IO, Generic, TypeVar
from urllib.parse import urlparse

import pandas as pd

from back.scripts.adapters.loaders.fetcher import HttpFetcher, LocalFetcher
from back.scripts.interfaces.loader import T_DF, IDecoder, IFetcher, IReader

LOGGER = logging.getLogger(__name__)


class DataLoader(Generic[T_DF]):
    """
    Orchestrates the data loading process using a fetcher, decoder, and reader.
    """

    def __init__(
        self, fetcher: IFetcher, reader: IReader[T_DF], decoder: IDecoder | None = None
    ):
        self.fetcher = fetcher
        self.reader = reader
        self.decoder = decoder

    def load(self, uri: str, **kwargs) -> T_DF:
        LOGGER.debug(f"Loading data from: {uri}")
        with self.fetcher.fetch(uri) as byte_stream:
            stream: IO = byte_stream
            if self.decoder:
                stream = self.decoder.decode(byte_stream)

            return self.reader.read(stream, **kwargs)


def create_data_loader(
    uri: str, reader: IReader[T_DF], decoder: IDecoder | None = None
) -> DataLoader[T_DF]:
    """
    Factory function to create a DataLoader with the appropriate fetcher.
    """
    is_url = urlparse(uri).scheme.startswith("http")
    fetcher = HttpFetcher() if is_url else LocalFetcher()
    return DataLoader(fetcher=fetcher, reader=reader, decoder=decoder)
