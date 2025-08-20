from pathlib import Path
from typing import Generic, Protocol, TypeVar

import pandas as pd
import polars as pl

from back.scripts.datasets.entities import FileMetadata

T_DF = TypeVar("T_DF", pd.DataFrame, pl.LazyFrame)


class IFileParser(Protocol, Generic[T_DF]):
    """
    Interface for parsing a raw data file into a DataFrame.
    """

    def parse(self, file_metadata: FileMetadata, raw_filename: Path) -> T_DF | None:
        """
        Parses a raw data file.

        Args:
            file_metadata: Metadata about the file to process.
            raw_filename: The local path to the raw file.

        Returns:
            A pandas DataFrame containing the parsed data, or None if parsing fails.
        """
        ...
