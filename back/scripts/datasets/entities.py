from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass
class FileMetadata:
    """A generic container for file metadata, decoupled from any framework."""

    #data_folder: str
    url: str
    format: str
    url_hash: str  # used a unique identifier for the file
    extra_data: dict[str, Any] = field(default_factory=dict)

    def get_raw_path(self) -> Path:
        """
        Determines the local path for the raw downloaded file.
        """
        return self.data_folder / self.url_hash / f"raw.{self.format}"

    def get_norm_path(self) -> Path:
        """
        Determines the local path for the normalized parquet file.
        """
        return self.data_folder / self.url_hash / "norm.parquet"

    def get_validation_path(self) -> Path:
        """
        Determines the local path for the validation parquet file.
        """
        return self.data_folder / self.url_hash / "validation.parquet"
