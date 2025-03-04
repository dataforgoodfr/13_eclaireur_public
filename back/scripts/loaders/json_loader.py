import json
from io import BytesIO, StringIO

import pandas as pd

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
            df = self._process_dict(json.loads(StringIO(data)))
        elif isinstance(data, bytes):
            df = self._process_dict(json.load(BytesIO(data)))
        else:
            raise Exception("Unhandled type")

        self.logger.info(f"JSON Data from {self.file_url} loaded.")
        return df

    def _process_dict(self, data: dict | list) -> pd.DataFrame:
        if isinstance(data, list):
            return pd.DataFrame.from_records(data)

        if isinstance(data, dict):
            for _, v in data.items():
                if isinstance(v, list):
                    return pd.DataFrame.from_records(v)
        raise RuntimeError("Did not identified JSON pattern")
