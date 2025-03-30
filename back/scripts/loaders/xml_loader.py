import logging
from io import StringIO

import pandas as pd

from .base_loader import BaseLoader

LOGGER = logging.getLogger(__name__)


class XMLLoader(BaseLoader):
    file_extensions = {"parquet"}

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
        try:
            df = pd.read_xml(StringIO(decoded_content))
            LOGGER.debug(
                f"XML Data from {self.file_url} loaded successfully. Shape: {df.shape}"
            )
            return df
        except Exception:
            # Continue to next encoding
            return
