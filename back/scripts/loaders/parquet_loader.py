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
    file_extensions = {"parquet"}

    def __init__(self, file_url, columns_to_keep=None, **kwargs):
        super().__init__(file_url, **kwargs)
        self.columns_to_keep = columns_to_keep

    def _load_from_url(self):
        with tempfile.TemporaryDirectory() as tempdir:
            filename = Path(tempdir) / "test.parquet"
            urllib.request.urlretrieve(self.file_url, filename)
            return pd.read_parquet(filename, columns=self.columns_to_keep)

    def _load_from_file(self):
        return pd.read_parquet(self.file_url, columns=self.columns_to_keep)
