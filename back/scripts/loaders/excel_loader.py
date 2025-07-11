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

    file_extensions = {"xls", "xlsx", "excel", "ods", "odf", "odt"}
    file_media_type_regex = re.compile(r"(excel|spreadsheet|xls|xlsx)", flags=re.IGNORECASE)

    def get_loader_kwargs(self):
        kwargs = super().get_loader_kwargs()
        if "columns" in kwargs:
            kwargs["usecols"] = kwargs.pop("columns")

        return kwargs

    def process_data(self, data: bytes) -> pd.DataFrame:
        df = pd.read_excel(BytesIO(data), **self.get_loader_kwargs())
        LOGGER.debug(f"Excel Data from {self.file_url} loaded.")
        return df
