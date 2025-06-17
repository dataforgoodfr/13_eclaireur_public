import logging
from io import StringIO

import pandas as pd

from back.scripts.loaders import EncodedDataLoader
from back.scripts.loaders.utils import register_loader

LOGGER = logging.getLogger(__name__)


@register_loader
class XMLLoader(EncodedDataLoader):
    file_extensions = {"xml", "rdf"}

    def process_from_decoded(self, decoded_content):
        try:
            df = pd.read_xml(StringIO(decoded_content))
        except Exception as e:
            LOGGER.warning(f"Error while reading XML: {e}")
            return

        LOGGER.debug(f"XML Data from {self.file_url} loaded successfully. Shape: {df.shape}")
        return df
