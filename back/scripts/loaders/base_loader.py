import logging
import os
import re
from urllib.parse import urlparse

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


def retry_session(retries, session=None, backoff_factor=0.3):
    """
    Configure resquests for multiple retries.
    https://stackoverflow.com/questions/49121365/implementing-retry-for-requests-in-python
    """
    session = session or requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


class BaseLoader:
    """
    Base class for data loaders.
    """

    def __init__(self, file_url, num_retries=3, delay_between_retries=5):
        # file_url : URL of the file to load
        # num_retries : Number of retries in case of failure
        # delay_between_retries : Delay between retries in seconds
        self.file_url = file_url
        self.num_retries = num_retries
        self.delay_between_retries = delay_between_retries
        self.logger = logging.getLogger(__name__)

    def load(self):
        parsed_url = urlparse(self.file_url)

        if parsed_url.scheme == "file":
            # Handle local file
            local_path = parsed_url.path
            if local_path.startswith("./"):
                local_path = os.path.abspath(local_path)
            with open(local_path, "rb") as file:
                return self.process_data(file.read())

        s = retry_session(self.num_retries, backoff_factor=self.delay_between_retries)
        response = s.get(self.file_url)
        if response.status_code == 200:
            return self.process_data(response.content)

        self.logger.error(f"Failed to load data from {self.file_url}")
        return None

    def process_data(self, data):
        raise NotImplementedError("This method should be implemented by subclasses.")

    @staticmethod
    def loader_factory(file_url, dtype=None, columns_to_keep=None):
        # Factory method to create the appropriate loader based on the file URL
        from .csv_loader import CSVLoader
        from .excel_loader import ExcelLoader
        from .json_loader import JSONLoader

        logger = logging.getLogger(__name__)

        parsed_url = urlparse(file_url)
        if parsed_url.scheme == "file":
            content_type = file_url.split(".")[-1]
        else:
            # Get the content type of the file from the headers
            response = requests.head(file_url)
            content_type = response.headers.get("content-type")

        # Determine the loader based on the content type
        if "json" in content_type:
            return JSONLoader(file_url)
        elif "csv" in content_type:
            return CSVLoader(file_url, dtype, columns_to_keep)
        elif re.search(
            r"(excel|spreadsheet|xls|xlsx)", content_type, re.IGNORECASE
        ) or file_url.endswith((".xls", ".xlsx")):
            return ExcelLoader(file_url, dtype, columns_to_keep)
        else:
            logger = logging.getLogger(__name__)
            logger.warning(f"Type de fichier non pris en charge pour l'URL : {file_url}")
            return None
