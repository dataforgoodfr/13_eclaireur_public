import logging
import tempfile
import urllib.request
from pathlib import Path

import pandas as pd

from .base_loader import BaseLoader

LOGGER = logging.getLogger(__name__)


class ParquetLoader(BaseLoader):
    file_extensions = {"parquet"}

    def __init__(self, file_url, columns_to_keep=None, **kwargs):
        super().__init__(file_url, **kwargs)
        self.columns_to_keep = columns_to_keep

    def load(self):
        try:
            if self.is_url:
                return self._load_url()
            else:
                return pd.read_parquet(self.file_url, columns=self.columns_to_keep)
        except Exception as e:
            LOGGER.warning(f"Failed to download file {self.file_url}: {e}")

    def _load_url(self):
        with tempfile.TemporaryDirectory() as tempdir:
            filename = Path(tempdir) / "test.parquet"
            urllib.request.urlretrieve(self.file_url, filename)
            return pd.read_parquet(filename, columns=self.columns_to_keep)
