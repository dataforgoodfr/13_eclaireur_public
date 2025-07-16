from typing import Iterable, Protocol

from back.scripts.datasets.entities import FileMetadata


class IDataSource(Protocol):
    """
    Interface for a data source that provides file metadata to be processed.
    """

    def get_files(self) -> Iterable[FileMetadata]:
        """
        Retrieves an iterable of file metadata objects.

        Returns:
            An iterable of FileMetadata objects.
        """
        ...
