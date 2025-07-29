import io
import logging
import os
from typing import IO
from urllib.parse import urlparse

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from back.scripts.interfaces.loader import IFetcher

LOGGER = logging.getLogger(__name__)

RETRY_STATUS_CODES = (413, 429, 503)


def retry_session(
    retries: int | None,
    session: requests.Session | None = None,
    backoff_factor: float = 0.3,
):
    """
    Configure requests for multiple retries.
    """
    session = session or requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=RETRY_STATUS_CODES,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


class HttpFetcher(IFetcher):
    """
    Fetches data from a URL.
    """

    def __init__(self, num_retries: int | None = 3, delay_between_retries: float = 5.0):
        self.num_retries = num_retries
        self.delay_between_retries = delay_between_retries

    def fetch(self, uri: str) -> IO[bytes]:
        s = retry_session(retries=self.num_retries, backoff_factor=self.delay_between_retries)
        response = s.get(uri)
        response.raise_for_status()
        return io.BytesIO(response.content)


class LocalFetcher(IFetcher):
    """
    Fetches data from a local file.
    """

    def fetch(self, uri: str) -> IO[bytes]:
        parsed_url = urlparse(uri)
        local_path = parsed_url.path
        if local_path.startswith("./"):
            local_path = os.path.abspath(local_path)
        return open(local_path, "rb")
