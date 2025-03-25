import csv
import logging
import re
from io import StringIO

import pandas as pd

from .base_loader import BaseLoader

LOGGER = logging.getLogger(__name__)


class CSVLoader(BaseLoader):
    file_extensions = {"csv"}
    file_media_type_regex = re.compile(r"csv", flags=re.IGNORECASE)

    def __init__(self, file_url, columns=None, dtype=None, **kwargs):
        """
        Initialize the CSV loader for either URL or local file.

        Args:
            source (str): URL or file path to the CSV file
            columns (list, optional): List of column names to keep
            dtype (dict, optional): Dictionary of column data types
            logger (logging.Logger, optional): Logger object for logging
        """
        super().__init__(file_url, **kwargs)
        self.columns = columns
        self.dtype = dtype

    def process_data(self, data) -> pd.DataFrame | None:
        # Try different encodings for the data
        encodings_to_try = ["utf-8-sig", "windows-1252", "latin1", "utf-16"]

        for encoding in encodings_to_try:
            try:
                decoded_content = data.decode(encoding)
                LOGGER.debug(f"Successfully decoded using {encoding} encoding")
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

        if self.columns is not None:
            csv_params["usecols"] = lambda c: c in self.columns

        try:
            dialect = sniffer.sniff(sample)
            csv_params["header"] = 0 if sniffer.has_header(sample) else None
            csv_params["delimiter"] = dialect.delimiter
            LOGGER.debug(f"Detected delimiter: '{dialect.delimiter}'")

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
