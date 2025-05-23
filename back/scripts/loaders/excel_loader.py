import re
from io import BytesIO
from pathlib import Path
from typing import List, Optional, Union

import pandas as pd

from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.loaders.common import register_loader


@register_loader
class ExcelLoader(BaseLoader):
    """
    Loader for Excel files.
    """

    file_extensions = {"xls", "xlsx", "excel"}
    file_media_type_regex = re.compile(r"(excel|spreadsheet|xls|xlsx)", flags=re.IGNORECASE)

    def __init__(
        self,
        file_url: Union[str, Path],
        dtype: Optional[dict] = None,
        columns: Optional[List[str]] = None,
        **kwargs,
    ) -> None:
        super().__init__(file_url, **kwargs)
        self.dtype = dtype
        self.columns = columns

    def process_data(self, data: bytes) -> pd.DataFrame:
        df = pd.read_excel(BytesIO(data), dtype=self.dtype)

        if self.columns is not None:
            df = df[self.columns]

        self.logger.debug(f"Excel Data from {self.file_url} loaded.")
        return df
