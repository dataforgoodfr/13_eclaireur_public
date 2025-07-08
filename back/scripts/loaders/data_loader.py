import logging
from typing import IO
from urllib.parse import urlparse

import pandas as pd
import polars as pl

from back.scripts.adapters.loaders.fetcher import HttpFetcher, LocalFetcher
from back.scripts.interfaces.loader import IDecoder, IFetcher, IPolarReader, IReader

LOGGER = logging.getLogger(__name__)


class DataLoader:
    """
    Orchestrates the data loading process using a fetcher, decoder, and reader.
    """

    def __init__(
        self,
        fetcher: IFetcher,
        reader: IReader | None = None,
        decoder: IDecoder | None = None,
        polar_reader: IPolarReader | None = None,
    ):
        self.fetcher = fetcher
        self.reader = reader
        self.decoder = decoder
        self.polar_reader = polar_reader

    def load(self, uri: str, **kwargs) -> pd.DataFrame:
        LOGGER.debug(f"Loading data from: {uri}")
        if not self.reader:
            raise ValueError("Pandas reader is not configured.")
        with self.fetcher.fetch(uri) as byte_stream:
            stream: IO = byte_stream
            if self.decoder:
                stream = self.decoder.decode(byte_stream)

            return self.reader.read(stream, **kwargs)

    def load_lazy(self, uri: str, **kwargs) -> pl.LazyFrame:
        """
        Loads data from a local URI into a Polars LazyFrame.
        Raises an error if a remote URI is provided.
        """
        LOGGER.debug(f"Lazy loading data from: {uri}")

        if not self.polar_reader:
            raise ValueError("Polar reader is not configured.")
        with self.fetcher.fetch(uri) as byte_stream:
            stream: IO = byte_stream
            return self.polar_reader.read(stream, **kwargs)


def create_data_loader(
    uri: str,
    reader: IReader | None = None,
    decoder: IDecoder | None = None,
    polar_reader: IPolarReader | None = None,
) -> DataLoader:
    """
    Factory function to create a DataLoader with the appropriate fetcher.
    """
    is_url = urlparse(uri).scheme.startswith("http")
    fetcher = HttpFetcher() if is_url else LocalFetcher()
    return DataLoader(
        fetcher=fetcher, reader=reader, decoder=decoder, polar_reader=polar_reader
    )
