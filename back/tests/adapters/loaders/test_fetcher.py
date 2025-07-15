import os
import tempfile

import pytest
import responses
from requests import HTTPError

from back.scripts.adapters.loaders.fetcher import HttpFetcher, LocalFetcher


class TestHttpFetcher:
    @responses.activate
    def test_fetch_success(self):
        # Given: A valid URL that returns a successful response
        url = "http://example.com/data"
        responses.add(responses.GET, url, body="test data", status=200)
        fetcher = HttpFetcher()

        # When: The fetch method is called
        data = fetcher.fetch(url)

        # Then: The fetched data is correct
        assert data.read() == b"test data"

    @responses.activate
    def test_fetch_with_retries(self):
        # Given: A URL that fails twice before succeeding
        url = "http://example.com/data"
        responses.add(responses.GET, url, status=429)
        responses.add(responses.GET, url, status=429)
        responses.add(responses.GET, url, body="test data", status=200)
        fetcher = HttpFetcher(num_retries=3, delay_between_retries=0.1)

        # When: The fetch method is called
        data = fetcher.fetch(url)

        # Then: The fetched data is correct and retries were made
        assert data.read() == b"test data"
        assert len(responses.calls) == 3

    @responses.activate
    def test_fetch_failure(self):
        # Given: A URL that consistently fails
        url = "http://example.com/data"
        responses.add(responses.GET, url, status=404)
        fetcher = HttpFetcher(num_retries=1)

        # When: The fetch method is called
        # Then: An HTTPError is raised
        with pytest.raises(HTTPError):
            fetcher.fetch(url)


class TestLocalFetcher:
    def test_fetch_absolute_path(self):
        # Given: An absolute path to an existing file
        with tempfile.NamedTemporaryFile(delete=False, mode="w") as tmp:
            tmp.write("test data")
            tmp_path = tmp.name
        fetcher = LocalFetcher()

        # When: The fetch method is called with the absolute path
        data = fetcher.fetch(f"file://{tmp_path}")

        # Then: The file content is read correctly
        assert data.read() == b"test data"
        os.remove(tmp_path)

    def test_fetch_relative_path(self):
        # Given: A relative path to an existing file
        with tempfile.NamedTemporaryFile(delete=False, mode="w", dir=".") as tmp:
            tmp.write("test data")
            tmp_path = tmp.name
        fetcher = LocalFetcher()

        # When: The fetch method is called with the relative path
        data = fetcher.fetch(f"file://{tmp_path}")

        # Then: The file content is read correctly
        assert data.read() == b"test data"
        os.remove(tmp_path)

    def test_fetch_nonexistent_file(self):
        # Given: A path to a nonexistent file
        fetcher = LocalFetcher()

        # When: The fetch method is called with the nonexistent path
        # Then: A FileNotFoundError is raised
        with pytest.raises(FileNotFoundError):
            fetcher.fetch("file:///nonexistent/file")
