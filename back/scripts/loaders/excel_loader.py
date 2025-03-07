import re
from io import BytesIO

import pandas as pd

from back.scripts.utils.dataframe_operation import detect_skipcolumns, detect_skiprows

from .base_loader import BaseLoader


class ExcelLoader(BaseLoader):
    """
    Loader for Excel files.
    """

    file_extensions = {"xls", "xlsx", "excel"}
    file_media_type_regex = re.compile(r"(excel|spreadsheet|xls|xlsx)", flags=re.IGNORECASE)

    def __init__(self, file_url, dtype=None, columns_to_keep=None, **kwargs):
        super().__init__(file_url, **kwargs)
        self.dtype = dtype
        self.columns_to_keep = columns_to_keep

    def process_data(self, data):
        df = pd.read_excel(BytesIO(data), dtype=self.dtype)

        # Detect and skip rows and columns with missing values
        skiprows = detect_skiprows(df)
        skipcols = detect_skipcolumns(df)

        # Load only the columns specified in columns_to_keep
        df = df.iloc[skiprows:, skipcols:]
        df.columns = df.iloc[0]
        df = df.drop(df.index[0]).reset_index(drop=True)

        if self.columns_to_keep is not None:
            df = df.loc[:, self.columns_to_keep]

        self.logger.info(f"Excel Data from {self.file_url} loaded.")
        return df
