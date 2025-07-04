import logging
from pathlib import Path

import requests

from back.scripts.datasets.entities import FileMetadata
from back.scripts.datasets.interfaces.file_downloader import IFileDownloader

LOGGER = logging.getLogger(__name__)


class HttpFileDownloader(IFileDownloader):
    """
    A file downloader that retrieves files from HTTP/HTTPS URLs.
    """

    def __init__(self, base_data_folder: Path):
        self.base_data_folder = base_data_folder
        self.base_data_folder.mkdir(exist_ok=True, parents=True)

    def _get_raw_path(self, file_metadata: FileMetadata) -> Path:
        """
        Determines the local path for the raw downloaded file.
        """
        return self.base_data_folder / file_metadata.url_hash / f"raw.{file_metadata.format}"

    def download(self, file_metadata: FileMetadata) -> Path | None:
        """
        Downloads the file specified in the metadata.
        If the file already exists, it is not re-downloaded.
        """
        output_filename = self._get_raw_path(file_metadata)
        if output_filename.exists():
            LOGGER.debug(f"File {output_filename} already exists, skipping download.")
            return output_filename

        output_filename.parent.mkdir(exist_ok=True, parents=True)

        try:
            with requests.get(file_metadata.url, stream=True) as r:
                r.raise_for_status()
                with open(output_filename, "wb") as f:
                    for chunk in r.iter_content(chunk_size=8192):
                        f.write(chunk)
            LOGGER.debug(f"Downloaded file {file_metadata.url}")
            return output_filename
        except requests.exceptions.HTTPError as error:
            LOGGER.warning(
                f"Failed to download {file_metadata.url}: HTTP {error.response.status_code}"
            )
        except requests.exceptions.RequestException as e:
            LOGGER.error(
                f"A requests error occurred while downloading {file_metadata.url}: {e}"
            )
        except Exception as e:
            LOGGER.error(
                f"An unexpected error occurred while downloading {file_metadata.url}: {e}"
            )

        return None
