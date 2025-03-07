import json
import re
from io import BytesIO, StringIO

import pandas as pd

from .base_loader import BaseLoader


class JSONLoader(BaseLoader):
    """
    Loader for JSON files.
    """

    file_extensions = {"json"}
    file_media_type_regex = re.compile(r"json", flags=re.IGNORECASE)

    def __init__(self, file_url, key=None, **kwargs):
        super().__init__(file_url, **kwargs)
        self.key = key

    def process_data(self, data):
        # hacky work-around, but for the time being, only used for schema
        if self.key is not None:
            data = json.loads(data)
            data = data.get(self.key, {})
            data = json.dumps(data)

        content = None
        if isinstance(data, str):
            content = json.loads(data)
        elif isinstance(data, bytes):
            content = json.load(BytesIO(data))
        else:
            raise Exception("Unhandled type")

        df = self._process_dict(content)
        self.logger.info(f"JSON Data from {self.file_url} loaded.")
        return df

    def _process_dict(self, json_data: dict | list) -> pd.DataFrame:
        """
        Recursively search the JSON for data to extract.
        dict and list are considered part of the structure and will be flattened.
        """
        items = None
        if isinstance(json_data, list):
            items = json_data
        elif isinstance(json_data, dict):
            for _, v in json_data.items():
                if not isinstance(v, list):
                    continue
                items = v
                break
        if items is None:
            raise RuntimeError("JSON has unexpected format")

        flattened_data = [self._flatten_json(item) for item in items]
        return pd.DataFrame(flattened_data)

    @staticmethod
    def _flatten_json(x: dict | list, prefix: str = "") -> dict:
        flattened = {}

        if isinstance(x, dict):
            for key, value in x.items():
                new_key = f"{prefix}__{key}" if prefix else key

                # Recursively flatten nested dictionaries or lists
                if isinstance(value, (dict, list)):
                    flattened.update(JSONLoader._flatten_json(value, new_key))
                else:
                    flattened[new_key] = value

        elif isinstance(x, list):
            for i, item in enumerate(x):
                new_key = f"{prefix}__{i}" if prefix else str(i)

                # Recursively flatten list items
                if isinstance(item, (dict, list)):
                    flattened.update(JSONLoader._flatten_json(item, new_key))
                else:
                    flattened[new_key] = item

        # For primitive types, just return the value
        else:
            flattened[prefix] = x

        return flattened
