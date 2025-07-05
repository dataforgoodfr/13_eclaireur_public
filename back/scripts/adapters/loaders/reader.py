import csv
import logging
import re
from io import TextIOWrapper
from typing import IO

import pandas as pd

from back.scripts.interfaces.loader import IReader

LOGGER = logging.getLogger(__name__)
STARTING_NEWLINE = re.compile(r"^(\r?\n)+")
WINDOWS_NEWLINE = re.compile(r"\r\n?")


class CsvReader(IReader[pd.DataFrame]):
    """
    Reads data from a CSV stream into a pandas DataFrame.
    """

    def read(self, stream: IO, **kwargs) -> pd.DataFrame:
        if not isinstance(stream, TextIOWrapper):
            raise TypeError("CsvReader requires a text stream.")

        # Prepare kwargs
        loader_kwargs = self._prepare_loader_kwargs(kwargs)

        # Sniff dialect
        delimiter, header = self._sniff_dialect(stream)
        loader_kwargs["delimiter"] = delimiter
        if header is not None:
            loader_kwargs["header"] = header

        LOGGER.debug(f"Detected delimiter: '{delimiter}'")

        try:
            df = pd.read_csv(stream, **loader_kwargs)
        except Exception as e:
            LOGGER.warning(f"Error while reading CSV: {e}")
            return pd.DataFrame()

        return df

    def _prepare_loader_kwargs(self, kwargs: dict) -> dict:
        # Set default pandas options
        prepared_kwargs = {
            "on_bad_lines": "skip",
            "low_memory": False,
        }
        prepared_kwargs.update(kwargs)

        # Adapt 'columns' to 'usecols' for pandas
        if "columns" in prepared_kwargs:
            columns = prepared_kwargs.pop("columns")
            prepared_kwargs["usecols"] = lambda c: c in columns

        return prepared_kwargs

    def _sniff_dialect(self, stream: TextIOWrapper) -> tuple[str, int | None]:
        sample = stream.read(4096)
        stream.seek(0)

        sample = STARTING_NEWLINE.sub("", sample)
        sample = WINDOWS_NEWLINE.sub("\n", sample)

        sniffer = csv.Sniffer()
        try:
            dialect = sniffer.sniff(sample)
            delimiter = dialect.delimiter
            header = 0 if sniffer.has_header(sample) else None
        except csv.Error as e:
            LOGGER.warning(f"CSV Sniffer error: {e}")
            # Fallback to most common delimiter
            counts = {sep: sample.count(sep) for sep in (",", ";", "\t")}
            delimiter = max(counts, key=counts.get)
            header = None  # Cannot determine header reliably

        return delimiter, header
