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
    """
    Initialize the CSV loader for either URL or local file.
    """

    def get_loader_kwargs(self):
        kwargs = super().get_loader_kwargs()
        kwargs |= {
            "on_bad_lines": "skip",
            "low_memory": False,
        }
        # Sometimes you don't know which loader class is going to be called, especially during a `BaseLoader.loader_factory`
        # columns attribute is useful for `parquet_loader` and usecols attribute for `csv_loader` and `excel_loader`
        if "columns" in kwargs:
            kwargs["usecols"] = kwargs.pop("columns")

        return kwargs

    def process_from_decoded(self, decoded_content) -> pd.DataFrame | None:
        loader_kwargs = self.get_loader_kwargs()

        # If the delimiter is not specified, try to detect it
        decoded_content = STARTING_NEWLINE.sub("", decoded_content)
        decoded_content = WINDOWS_NEWLINE.sub("\n", decoded_content)
        sniffer = csv.Sniffer()
        sample = decoded_content[: min(4096, len(decoded_content))]

        try:
            dialect = sniffer.sniff(sample)
            loader_kwargs["header"] = 0 if sniffer.has_header(sample) else None
        except csv.Error as e:
            LOGGER.warning(f"CSV Sniffer error: {e}")
            # Try to find the most common delimiter
            counts = {sep: decoded_content.count(sep) for sep in (",", ";", "\t")}
            delimiter = max(counts, key=counts.get)
        else:
            delimiter = dialect.delimiter

        loader_kwargs["delimiter"] = delimiter
        LOGGER.debug(f"Detected delimiter: '{delimiter}'")

        try:
            df = pd.read_csv(StringIO(decoded_content), **loader_kwargs)
        except Exception as e:
            LOGGER.warning(f"Error while reading CSV: {e}")
            return

        LOGGER.debug(f"CSV Data from {self.file_url} loaded successfully. Shape: {df.shape}")
        return df
