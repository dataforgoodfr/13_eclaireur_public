from pathlib import Path
from typing import Protocol

from back.scripts.datasets.entities import FileMetadata


class IFileUpdateChecker(Protocol):
    """
    Interface for a component that compare a local file and it's remote copy.
    """

    def need_rebuild(self) -> bool:
        """
        every call of need_update()
        """
        ...
    
    def need_update(self, file_metadata: FileMetadata) -> bool | None:
        """
        Compare metadata fields of the file specified in the metadata againts remote ones.
        The comparison can be done by a callback.

        Args:
            file_metadata: The metadata of the file to check.

        Returns:
            True if the file needs to be downloaded and processed, False if the file is up to date so processed ones are too... or None if no metadata where found -> better to download it again ?
        """
        ...
