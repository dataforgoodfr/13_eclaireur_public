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

    def _load_from_url(self) -> pd.DataFrame:
        with tempfile.TemporaryDirectory() as tempdir:
            filename = Path(tempdir) / "test.parquet"
            urllib.request.urlretrieve(self.file_url, filename)
            return pd.read_parquet(filename, **self.get_loader_kwargs())

    def _load_from_file(self) -> pd.DataFrame:
        return pd.read_parquet(self.file_url, **self.get_loader_kwargs())
