import logging
import re
from io import BytesIO

import pandas as pd

from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.loaders.utils import register_loader

LOGGER = logging.getLogger(__name__)


@register_loader
class ExcelLoader(BaseLoader):
    """
    Loader for Excel files.
    """

    file_extensions = {"xls", "xlsx", "excel"}
    file_media_type_regex = re.compile(r"(excel|spreadsheet|xls|xlsx)", flags=re.IGNORECASE)

    def __init__(
        self, *args, dtype: dict | None = None, columns: list[str] | None = None, **kwargs
    ) -> None:
        super().__init__(*args, **kwargs)
        self.dtype = dtype
        self.columns = columns

    def process_data(self, data: bytes) -> pd.DataFrame:
        df = pd.read_excel(BytesIO(data), dtype=self.dtype)

        if self.columns is not None:
            df = df[self.columns]

        LOGGER.debug(f"Excel Data from {self.file_url} loaded.")
        return df
