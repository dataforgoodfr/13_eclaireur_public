from io import TextIOWrapper
from typing import IO, Protocol

import pandas as pd
import polars as pl


class IFetcher(Protocol):
    """
    Interface for a component that fetches data from a source.
    """

    def fetch(self, uri: str) -> IO[bytes]:
        """
        Fetches data from a given URI (URL or local path).

        Args:
            uri: The URI of the resource to fetch.

        Returns:
            A raw byte stream of the data.
        """
        ...


class IDecoder(Protocol):
    """
    Interface for a component that decodes a byte stream into a text stream.
    """

    def decode(self, stream: IO[bytes]) -> TextIOWrapper:
        """
        Decodes a byte stream using a suitable character encoding.

        Args:
            stream: The byte stream to decode.

        Returns:
            A decoded text stream.
        """
        ...


class IReader(Protocol):
    """
    Interface for a component that parses a stream into a pandas DataFrame.
    """

    def read(self, stream: IO, **kwargs) -> pd.DataFrame:
        """
        Reads data from a stream and converts it into a pandas DataFrame.

        Args:
            stream: The stream to read from (can be bytes or text).
            **kwargs: Additional arguments for the reader.

        Returns:
            A pandas DataFrame containing the data.
        """
        ...


class IPolarReader(Protocol):
    """
    Interface for a component that parses a stream into a polars LazyFrame.
    """

    def read(self, stream: IO, **kwargs) -> pl.LazyFrame:
        """
        Reads data from a stream and converts it into a polars LazyFrame.

        Args:
            stream: The stream to read from (can be bytes or text).
            **kwargs: Additional arguments for the reader.

        Returns:
            A polars LazyFrame containing the data.
        """
        ...
