import logging
import tempfile
import urllib.request
from pathlib import Path

import pandas as pd

from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.loaders.utils import register_loader

LOGGER = logging.getLogger(__name__)


@register_loader
class ParquetLoader(BaseLoader):
    """

    Args:
        columns (list, optional): List of column names to keep
    """

    file_extensions = {"parquet"}

    def __init__(self, *args, columns: list[str] | None = None, **kwargs):
        super().__init__(*args, **kwargs)
        self.columns = columns

    def _load_from_url(self) -> pd.DataFrame:
        with tempfile.TemporaryDirectory() as tempdir:
            filename = Path(tempdir) / "test.parquet"
            urllib.request.urlretrieve(self.file_url, filename)
            return pd.read_parquet(filename, columns=self.columns)

    def _load_from_file(self) -> pd.DataFrame:
        return pd.read_parquet(self.file_url, columns=self.columns)
