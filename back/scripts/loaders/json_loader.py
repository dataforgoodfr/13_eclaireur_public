import pandas as pd

from .base_loader import BaseLoader
from .jsonl_converter import convert_to_jsonl

class JSONLoader(BaseLoader):
    """
    Loader for JSON files.
    """

    def __init__(self, file_url, key=None, flatten=False, **kwargs):
        super().__init__(file_url, **kwargs)
        self.key = key

    def process_data(self, filepath):

        if self.flatten:
            flatten_file_path = filepath.with_suffix(".jsonl")
            convert_to_jsonl(filepath, flatten_file_path, self.key)
            filepath = flatten_file_path


        if self.key is not None:
            data = data.get(self.key, {})

        self.logger.info(f"JSON Data from {self.file_url} loaded.")
        if self.normalize:
            return pd.json_normalize(data)
        else:
            return pd.read_json(
                filepath,
                lines=True,
                chunksize=1000)
