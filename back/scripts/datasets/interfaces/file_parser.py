from pathlib import Path
from typing import Protocol

import pandas as pd

from back.scripts.datasets.entities import FileMetadata


class IFileParser(Protocol):
    """
    Interface for parsing a raw data file into a DataFrame.
    """

    def parse(self, file_metadata: FileMetadata, raw_filename: Path) -> pd.DataFrame | None:
        """
        Parses a raw data file.

        Args:
            file_metadata: Metadata about the file to process.
            raw_filename: The local path to the raw file.

        Returns:
            A pandas DataFrame containing the parsed data, or None if parsing fails.
        """
        ...
