import csv
import pandas as pd
from io import StringIO

from .base_loader import BaseLoader


class CSVLoader(BaseLoader):
    """
    Loader for CSV files.
    """

    def __init__(self, file_url, dtype=None, columns_to_keep=None, **kwargs):
        super().__init__(file_url, **kwargs)
        self.dtype = dtype
        self.columns_to_keep = columns_to_keep

    @staticmethod
    def _get_encoding_and_delimiter(self, filepath):
        """Detect the encoding and delimiter used in the CSV file"""
        encodings_to_try = ["utf-8", "windows-1252", "latin1"]

        for encoding in encodings_to_try:
            # try to read first line with encoding
            try:
                with open(filepath, encoding=encoding, buffering=1) as file:
                    return encoding, self.detect_delimiter(file.readline())
            except Exception:
                pass

        self.logger.error(
            f"Impossible de décoder le contenu du fichier CSV à l'URL : {self.file_url}"
        )
        return None, None


        # Load only the columns specified in columns_to_keep, and skip bad lines
        # TODO(memory): low_memory=True can lead to mixed type inference > might break things
    def process_data(self, filepath):
        encoding, delimiter = self._get_encoding_and_delimiter(self, filepath)
        if self.columns_to_keep is not None:
            chunks = pd.read_csv(
                filepath,
                delimiter=delimiter,
                dtype=self.dtype,
                usecols=lambda c: c in self.columns_to_keep,
                on_bad_lines="skip",
                quoting=csv.QUOTE_MINIMAL,
                low_memory=True,
                chunksize=1000,
                encoding=encoding,
            )
        else:
            chunks = pd.read_csv(
                filepath,
                delimiter=delimiter,
                dtype=self.dtype,
                on_bad_lines="skip",
                quoting=csv.QUOTE_MINIMAL,
                low_memory=True,
                chunksize=1000,
                encoding=encoding,
            )

        self.logger.info(f"CSV Data from {self.file_url} loaded.")
        return chunks

    @staticmethod
    def detect_delimiter(text, num_lines=5):
        delimiters = [",", ";", "\t", "|"]
        # This function detects the delimiter used in a CSV file
        # It reads the first num_lines of the file and counts the occurrences of each delimiter
        counts = {delimiter: 0 for delimiter in delimiters}
        line_counts = {delimiter: 0 for delimiter in delimiters}

        for line_number, line in enumerate(StringIO(text)):
            if line_number >= num_lines:
                break
            for delimiter in delimiters:
                if delimiter in line:
                    counts[delimiter] += line.count(delimiter)
                    line_counts[delimiter] += 1

        averages = {
            delimiter: counts[delimiter] / line_counts[delimiter]
            for delimiter in delimiters
            if line_counts[delimiter] > 0
        }
        return max(averages, key=averages.get)
