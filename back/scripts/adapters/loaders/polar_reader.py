from pathlib import Path
from typing import IO, List, Union

import polars as pl

from back.scripts.interfaces.loader import IPolarReader

SourceType = Union[
    str,
    Path,
    IO[str],
    IO[bytes],
    bytes,
    List[str],
    List[Path],
    List[IO[str]],
    List[IO[bytes]],
    List[bytes],
]


class PolarCsvReader(IPolarReader):
    """
    A reader for CSV files that produces a Polars LazyFrame.
    """

    def read(self, source: SourceType, **kwargs) -> pl.LazyFrame:
        """
        Lazily reads a CSV file from a given source.

        Args:
            source: The source to read from.
            **kwargs: Additional arguments for polars.scan_csv.

        Returns:
            A Polars LazyFrame.
        """
        return pl.scan_csv(source, **kwargs)
