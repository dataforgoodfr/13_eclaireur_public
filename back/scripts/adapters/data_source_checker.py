import logging
from pathlib import Path

from typing import Any, Callable

import requests

from back.scripts.datasets.entities import FileMetadata
from back.scripts.interfaces.file_checker import IFileUpdateChecker

LOGGER = logging.getLogger(__name__)

def default_url_builder(fmt: str, datasetid: str):
    """
        
    """
    return fmt.format(datasetid=datasetid)


def default_comparator(remote: Any, local: FileMetadata) -> bool | None:
    """
        
    """
    return None


class ApiChecker(IFileUpdateChecker):
    """

    """

    def __init__(self, url_pattern: str = None,
                 url_builder: Callable[str, str] = default_url_builder,
                 comparator: Callable[str, FileMetadata] = default_comparator):
        """
        
        """
        self.url_pattern = url_pattern
        self.url_builder = url_builder 
        self.comparator = comparator
        self.is_one_file_updated = False
        pass

    def need_rebuild(self) -> bool:
        return self.is_one_file_updated

    def _return_true(self) -> bool:
        """
        update internal state in case of update.
        this will trigger an update of module dataset
        """
        self.is_one_file_updated = True
        return True
    
    def need_update(self, file_metadata: FileMetadata) -> bool | None:
        """
        
        """
        raw_path = file_metadata.get_raw_path()
        if not raw_path.exists():
            LOGGER.debug(f"raw path not exists : require download {raw_path}");
            return self._return_true()

        url = self.url_builder(self.url_pattern, file_metadata.extra_data["datasetid"])

        try:
            resp = requests.get(url) 
            resp.raise_for_status()

            remote_file_md = resp.json()
            if self.comparator(remote_file_md, file_metadata):
                LOGGER.debug(f"raw path needs update : require download {raw_path}, deleting {norm_path}");
                norm_path = file_metadata.get_norm_path()
                raw_path.unlink(missing_ok=True)
                norm_path.unlink(missing_ok=True)
                return self._return_true()
            return False
        
        except requests.exceptions.HTTPError as error:
            LOGGER.warning(
                f"Failed to access {url}: HTTP {error.response.status_code}"
            )
        except requests.exceptions.RequestException as e:
            LOGGER.error(
                f"A requests error occurred while downloading {url}: {e}"
            )
        except Exception as e:
            LOGGER.error(
                f"An unexpected error occurred while downloading {url}: {e}"
            )

        return self._return_true()
        




class DataGouvChecker(IFileUpdateChecker):
    """

    """

    def __init__(self):
        """
        
        """
        pass

    
    def need_update(self, file_metadata: FileMetadata) -> bool | None:
        """
        
        """
        return True
        
