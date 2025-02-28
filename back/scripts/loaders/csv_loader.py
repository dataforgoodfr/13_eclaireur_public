import csv
import logging
import os
from io import StringIO

import pandas as pd
import requests

from .base_loader import BaseLoader

LOGGER = logging.getLogger(__name__)


def get_delimiter(file_path, bytes=4096):
    sniffer = csv.Sniffer()
    data = open(file_path, "r").read(bytes)
    delimiter = sniffer.sniff(data).delimiter
    return delimiter


class CSVLoader(BaseLoader):
    def __init__(self, source, columns_to_keep=None, dtype=None):
        """
        Initialize the CSV loader for either URL or local file.

        Args:
            source (str): URL or file path to the CSV file
            columns_to_keep (list, optional): List of column names to keep
            dtype (dict, optional): Dictionary of column data types
            logger (logging.Logger, optional): Logger object for logging
        """
        self.source = source
        self.columns_to_keep = columns_to_keep
        self.dtype = dtype

        self.is_url = source.startswith(("http://", "https://"))

    def load(self):
        """Load the CSV data from either URL or local file."""
        if self.is_url:
            return self._load_from_url()
        else:
            return self._load_from_file()

    def _load_from_url(self):
        """Load CSV data from a URL."""
        try:
            response = requests.get(self.source)
            if response.status_code != 200:
                LOGGER.error(
                    f"Failed to retrieve data from URL: {self.source}. Status code: {response.status_code}"
                )
                return None

            return self.process_data(response.content)
        except Exception as e:
            LOGGER.error(f"Error loading data from URL {self.source}: {str(e)}")
            return None

    def _load_from_file(self):
        """Load CSV data from a local file."""
        try:
            if not os.path.exists(self.source):
                LOGGER.error(f"File not found: {self.source}")
                return None

            with open(self.source, "rb") as file:
                data = file.read()
            return self.process_data(data)
        except Exception as e:
            LOGGER.error(f"Error loading data from file {self.source}: {str(e)}")
            return None

    def process_data(self, data):
        """
        Process binary data into a pandas DataFrame.

        Args:
            data (bytes): The binary CSV data

        Returns:
            pandas.DataFrame: The loaded data or None if processing fails
        """
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

        LOGGER.error(f"Unable to process CSV content from: {self.source}")
        return None

    def _process_from_decoded(self, decoded_content):
        # Use csv.Sniffer to detect the dialect and delimiter
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
            dialect = sniffer.sniff(sample)
            delimiter = dialect.delimiter
            LOGGER.debug(f"Detected delimiter: '{delimiter}', Has header: {has_header}")

            csv_params["delimiter"] = delimiter
            csv_params["header"] = 0 if has_header else None

        except csv.Error as e:
            LOGGER.warning(f"CSV Sniffer error with encoding: {str(e)}")
            # If sniffer fails, try with default delimiter

        try:
            df = pd.read_csv(StringIO(decoded_content), **csv_params)
            LOGGER.debug(f"CSV Data from {self.source} loaded successfully. Shape: {df.shape}")
            return df
        except Exception:
            # Continue to next encoding
            return
