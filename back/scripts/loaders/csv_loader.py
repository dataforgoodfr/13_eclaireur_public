import csv
import logging
import re
from io import StringIO

import pandas as pd

from back.scripts.loaders import EncodedDataLoader
from back.scripts.loaders.utils import register_loader

LOGGER = logging.getLogger(__name__)
STARTING_NEWLINE = re.compile(r"^(\r?\n)+")
WINDOWS_NEWLINE = re.compile(r"\r\n?")


@register_loader
class CSVLoader(EncodedDataLoader):
    file_extensions = {"csv"}
    file_media_type_regex = re.compile(r"csv", flags=re.IGNORECASE)

    def __init__(
        self, *args, columns: list[str] | None = None, dtype: dict | None = None, **kwargs
    ):
        """
        Initialize the CSV loader for either URL or local file.

        Args:
            columns (list, optional): List of column names to keep
            dtype (dict, optional): Dictionary of column data types
        """
        super().__init__(*args, **kwargs)
        self.columns = columns
        self.dtype = dtype

    def process_from_decoded(self, decoded_content) -> pd.DataFrame | None:
        decoded_content = STARTING_NEWLINE.sub("", decoded_content)
        decoded_content = WINDOWS_NEWLINE.sub("\n", decoded_content)
        sniffer = csv.Sniffer()
        sample = decoded_content[: min(4096, len(decoded_content))]
        csv_params = {
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
        except csv.Error as e:
            LOGGER.warning(f"CSV Sniffer error: {e}")
            # Try to find the most common delimiter
            counts = {sep: decoded_content.count(sep) for sep in (",", ";", "\t")}
            delimiter = max(counts, key=counts.get)
        else:
            delimiter = dialect.delimiter

        csv_params["delimiter"] = delimiter
        LOGGER.debug(f"Detected delimiter: '{delimiter}'")

        try:
            df = pd.read_csv(StringIO(decoded_content), **csv_params)
        except Exception as e:
            LOGGER.warning(f"Error while reading CSV: {e}")
            return

        LOGGER.debug(f"CSV Data from {self.file_url} loaded successfully. Shape: {df.shape}")
        return df
