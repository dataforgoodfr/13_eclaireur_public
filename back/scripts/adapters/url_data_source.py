import csv
import hashlib
from pathlib import Path
from typing import Iterable

from back.scripts.datasets.entities import FileMetadata
from back.scripts.interfaces.data_source import IDataSource


def _sha256(s: str | None) -> str | None:
    """
    Generate SHA256 hash from a string.
    """
    return None if not s else hashlib.sha256(s.encode("utf-8")).hexdigest()


class UrlDataSource(IDataSource):
    """
    A data source that reads file metadata from a CSV file in a memory-efficient way.
    The CSV must contain at least a 'url' and 'format' column.
    """

    def __init__(self, csv_path: Path, delimiter: str = ";"):
        if not csv_path.exists():
            raise FileNotFoundError(f"Data source CSV not found at: {csv_path}")
        self.csv_path = csv_path
        self.delimiter = delimiter

    def get_files(self) -> Iterable[FileMetadata]:
        """
        Reads the CSV file row by row and yields a FileMetadata object for each one.
        """
        with open(self.csv_path, mode="r", encoding="utf-8") as infile:
            reader = csv.DictReader(infile, delimiter=self.delimiter)
            for row in reader:
                url = row.get("url")
                if not url:
                    continue

                url_hash = _sha256(url)
                if not url_hash:
                    continue

                format = row.get("format", "unknown")

                # Pop known keys to isolate extra data
                row.pop("url", None)
                row.pop("format", None)
                row.pop("url_hash", None)

                yield FileMetadata(
                    url=url,
                    format=format,
                    url_hash=url_hash,
                    extra_data=row,
                )
