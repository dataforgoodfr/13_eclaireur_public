from pathlib import Path
from typing import Protocol

from back.scripts.datasets.entities import FileMetadata


class IFileDownloader(Protocol):
    """
    Interface for a component that downloads a file.
    """

    def download(self, file_metadata: FileMetadata) -> Path | None:
        """
        Downloads the file specified in the metadata.

        Args:
            file_metadata: The metadata of the file to download.

        Returns:
            The local path to the downloaded file, or None if download fails.
        """
        ...
