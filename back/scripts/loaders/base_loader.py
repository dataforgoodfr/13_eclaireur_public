import time
import requests
import logging
import re


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
        attempt = 0
        while attempt < self.num_retries:
            try:
                # TODO(memory): instead of loading response into memory, we should do a streaming download to a temp file
                # using bellow _streaming_download_to_file add pass the path to process_data
                # can we get the filename from the response? and add some random string or timestamp to it?
                response = requests.get(self.file_url)
                if response.status_code == 200:
                    return self.process_data(response)
                else:
                    self.logger.error(f"Failed to load data from {self.file_url}")
                    attempt += 1
            except requests.exceptions.RequestException as e:
                self.logger.error(f"RequestException: {e}")
                attempt += 1
                time.sleep(self.delay_between_retries)

        return None

    def _streaming_download_to_file(url, output_filepath):
        with requests.get(url, stream=True) as response:
            response.raise_for_status()
            with open(output_filepath, 'wb') as output_file:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        output_file.write(chunk)
        print(f"Download complete. File saved as {output_filepath}")

    # TODO(memory): take filename as arg and return chunks
    # update implementation and client classes
    def process_data(self, filename):
        raise NotImplementedError("This method should be implemented by subclasses.")

    @staticmethod
    def loader_factory(file_url, dtype=None, columns_to_keep=None):
        # Factory method to create the appropriate loader based on the file URL
        from .json_loader import JSONLoader
        from .csv_loader import CSVLoader
        from .excel_loader import ExcelLoader

        logger = logging.getLogger(__name__)

        # Get the content type of the file from the headers
        response = requests.head(file_url)
        content_type = response.headers.get("content-type")
        # logger.info(f"Content type : {content_type}")

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
