import csv
import logging
from io import StringIO

import pandas as pd

from .base_loader import BaseLoader

LOGGER = logging.getLogger(__name__)


class CSVLoader(BaseLoader):
    def __init__(self, file_url, columns_to_keep=None, dtype=None, **kwargs):
        """
        Initialize the CSV loader for either URL or local file.

        Args:
            source (str): URL or file path to the CSV file
            columns_to_keep (list, optional): List of column names to keep
            dtype (dict, optional): Dictionary of column data types
            logger (logging.Logger, optional): Logger object for logging
        """
        super().__init__(file_url, **kwargs)
        self.file_url = file_url
        self.columns_to_keep = columns_to_keep
        self.dtype = dtype

        self.is_url = (
            file_url.startswith(("http://", "https://", "file:")) if file_url else False
        )

    def process_data(self, data) -> pd.DataFrame | None:
        # Try different encodings for the data
        encodings_to_try = ["utf-8", "windows-1252", "latin1", "utf-16"]

        for encoding in encodings_to_try:
            try:
                decoded_content = data.decode(encoding)
                LOGGER.info(f"Successfully decoded using {encoding} encoding")
                df = self._process_from_decoded(decoded_content)
                if isinstance(df, pd.DataFrame):
                    return df

            except UnicodeDecodeError:
                # Try the next encoding
                continue

        LOGGER.error(f"Unable to process CSV content from: {self.file_url}")
        return None

    def _process_from_decoded(self, decoded_content):
        sniffer = csv.Sniffer()
        sample = decoded_content[: min(4096, len(decoded_content))]
        csv_params = {
            "delimiter": ",",
            "on_bad_lines": "skip",
            "low_memory": False,
        }
        if self.dtype is not None:
            csv_params["dtype"] = self.dtype

        if self.columns_to_keep is not None:
            csv_params["usecols"] = lambda c: c in self.columns_to_keep

        try:
            has_header = sniffer.has_header(sample)
            csv_params["header"] = 0 if has_header else None

            dialect = sniffer.sniff(sample)
            csv_params["delimiter"] = dialect.delimiter
            LOGGER.debug(f"Detected delimiter: '{dialect.delimiter}', Has header: {has_header}")

        except csv.Error as e:
            LOGGER.warning(f"CSV Sniffer error with encoding: {str(e)}")
            # If sniffer fails, try with default delimiter

        try:
            df = pd.read_csv(StringIO(decoded_content), **csv_params)
            LOGGER.debug(
                f"CSV Data from {self.file_url} loaded successfully. Shape: {df.shape}"
            )
            return df
        except Exception:
            # Continue to next encoding
            return
