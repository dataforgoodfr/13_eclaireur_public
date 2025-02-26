from io import BytesIO, StringIO
import pandas as pd
import json
from .base_loader import BaseLoader


class JSONLoader(BaseLoader):
    """
    Loader for JSON files.
    """

    def __init__(self, file_url, key=None, **kwargs):
        super().__init__(file_url, **kwargs)
        self.key = key

    def process_data(self, data):
        # hacky work-around, but for the time being, only used for schema
        if self.key is not None:
            data = json.loads(data)
            data = data.get(self.key, {})
            data = json.dumps(data)

        if isinstance(data, str):
            df = pd.read_json(StringIO(data))
        elif isinstance(data, bytes):
            df = pd.read_json(BytesIO(data))
        else:
            raise Exception("Unhandled type")

        self.logger.info(f"JSON Data from {self.file_url} loaded.")
        return df
