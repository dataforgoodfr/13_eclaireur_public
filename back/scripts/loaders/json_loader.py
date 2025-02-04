import pandas as pd
import logging

from .base_loader import BaseLoader

class JSONLoader(BaseLoader):
    '''
    Loader for JSON files.
    '''
    
    def __init__(self, file_url, key=None, normalize=False, **kwargs):
        super().__init__(file_url, **kwargs)
        self.key = key
        self.normalize = normalize

    def process_data(self, response):
        data = response.json()

        if self.key is not None:
            data = data.get(self.key, {})

        self.logger.info(f"JSON Data from {self.file_url} loaded.")
        if self.normalize:
            return pd.json_normalize(data)
        else:
            return pd.DataFrame(data)
