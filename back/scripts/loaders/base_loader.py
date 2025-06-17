import logging
import os
import re
from pathlib import Path
from typing import Pattern, Self
from urllib.parse import urlparse

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from back.scripts.loaders.utils import LOADER_CLASSES

LOGGER = logging.getLogger(__name__)


def retry_session(
    retries: int | None,
    session: requests.Session | None = None,
    backoff_factor: float = 0.3,
):
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
    Args:
        file_extensions: Set of file extensions supported by the loader
        file_media_type_regex: Regular expression to match file media type
    """

    file_extensions: set[str] | None = None
    # http://www.iana.org/assignments/media-types/media-types.xhtml
    file_media_type_regex: Pattern[str] | str | None = None

    def __init__(
        self,
        file_url: str | Path,
        num_retries: int | None = 3,
        delay_between_retries: float = 5.0,
        **kwargs,
    ):
        """
        Args:
            file_url : URL of the file to load
            num_retries: Number of retries in case of failure
            delay_between_retries: Delay between retries in seconds
        """
        self.file_url = str(file_url)
        self.num_retries = num_retries
        self.delay_between_retries = delay_between_retries
        self.kwargs = kwargs

    def load(self, force: bool = True):
        # FIXME: force == True for retro-compatilibity reasons
        if not self.file_url:
            raise RuntimeError("Empty file URL provided")

        if not force and not self.can_load_file(self.file_url):
            raise RuntimeError(f"File {self.file_url} is not supported by this loader")

        if self.get_file_is_url(self.file_url):
            return self._load_from_url()
        else:
            return self._load_from_file()

    def _load_from_url(self):
        s = retry_session(self.num_retries, backoff_factor=self.delay_between_retries)
        response = s.get(self.file_url)
        if response.status_code == 200:
            return self.process_data(response.content)

        raise RuntimeError(f"Failed to load data from {self.file_url}")

    def _load_from_file(self):
        parsed_url = urlparse(self.file_url)
        try:
            local_path = parsed_url.path
            if local_path.startswith("./"):
                local_path = os.path.abspath(local_path)
            with open(local_path, "rb") as file:
                return self.process_data(file.read())
        except FileNotFoundError as e:
            LOGGER.error(f"File not found: {e}")
        except Exception as e:
            LOGGER.error(f"Failed to load data from {self.file_url}: {e}")
        return None

    def process_data(self, data):
        raise NotImplementedError("This method should be implemented by subclasses.")

    @classmethod
    def loader_factory(cls, file_url: str | Path, **loader_kwargs) -> Self:
        # Factory method to create the appropriate loader based on the file URL
        file_url = str(file_url)
        loader_class = cls.search_loader_class(file_url)
        if loader_class:
            return loader_class(file_url, **loader_kwargs)
        raise RuntimeError(f"File {file_url} is not supported by any loader")

    @staticmethod
    def get_file_is_url(file_url: str) -> bool:
        return urlparse(file_url).scheme.startswith("http")

    @classmethod
    def get_file_extension(cls, file_url: str) -> str:
        if not cls.get_file_is_url(file_url) and "." in file_url:
            return file_url.rsplit(".", 1)[-1]
        return ""

    @classmethod
    def get_file_media_type(cls, file_url: str) -> str:
        if cls.get_file_is_url(file_url):
            # Get the content type of the file from the headers
            response = requests.head(file_url)
            if response.status_code == 200:
                return response.headers.get("content-type", "")
            else:
                raise RuntimeError(f"Failed to load data from {file_url}")
        return ""

    @classmethod
    def search_loader_class(cls, file_url: str) -> type | None:
        """
        Searches for a loader class based on the file extension and content type.
        """
        file_extension = cls.get_file_extension(file_url)
        file_media_type = cls.get_file_media_type(file_url)

        for loader_class in set(LOADER_CLASSES.values()):
            if loader_class.can_load_file(
                file_extension=file_extension, file_media_type=file_media_type
            ):
                return loader_class

        return None

    @classmethod
    def can_load_file(
        cls, file_url: str = "", *, file_extension: str = "", file_media_type: str = ""
    ) -> bool:
        """
        Check if the given file URL, extension or content type can be loaded by the current loader class.
        """
        if file_url:
            if not file_extension:
                file_extension = cls.get_file_extension(file_url)
            if not file_media_type:
                file_media_type = cls.get_file_media_type(file_url)

        return cls.can_load_file_extension(file_extension) or cls.can_load_file_media_type(
            file_media_type
        )

    @classmethod
    def can_load_file_extension(cls, file_extension: str) -> bool:
        """
        Check if the given file extension can be loaded by the current loader class.
        """
        return bool(cls.file_extensions and file_extension in cls.file_extensions)

    @classmethod
    def can_load_file_media_type(cls, file_media_type: str) -> bool:
        """
        Check if the given file media type can be loaded by the current loader class.
        """
        can_load = False
        regex = cls.file_media_type_regex
        if regex and file_media_type:
            if isinstance(regex, str):
                can_load = re.search(regex, file_media_type)
            elif isinstance(regex, re.Pattern):
                can_load = regex.search(file_media_type)

        return bool(can_load)


class EncodedDataLoader(BaseLoader):
    def get_accepted_encodings(self) -> list[str]:
        # Try different encodings for the data, sorted by priority
        return ["utf-8-sig", "windows-1252", "latin1", "utf-16"]

    def process_data(self, data):
        for encoding in self.get_accepted_encodings():
            try:
                decoded_content = data.decode(encoding)
            except UnicodeDecodeError:
                LOGGER.debug(f"Failed to decode using {encoding} encoding")
                # Try the next encoding
                continue
            else:
                LOGGER.info(f"Successfully decoded using {encoding} encoding")
                decoded_data = self.process_from_decoded(decoded_content)
                if decoded_data is not None:
                    return decoded_data

        LOGGER.error(f"Unable to process content from: {self.file_url}")
        return None

    def process_from_decoded(self, decoded_content: str):
        raise NotImplementedError("This method should be implemented by subclasses.")
