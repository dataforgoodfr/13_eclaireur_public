import hashlib
import logging
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
import requests
import responses

from back.scripts.adapters.http_downloader import HttpFileDownloader
from back.scripts.datasets.entities import FileMetadata

# Configure logging for tests
logging.basicConfig(level=logging.DEBUG)


class TestHttpFileDownloader:
    @pytest.fixture
    def base_data_folder(self, tmp_path: Path) -> Path:
        """Fixture for a temporary data folder."""
        return tmp_path

    @pytest.fixture
    def file_metadata(self) -> FileMetadata:
        """Fixture for sample file metadata."""
        url = "http://example.com/testfile.txt"
        return FileMetadata(
            url=url,
            url_hash=hashlib.sha256(url.encode()).hexdigest(),
            format="txt",
        )

    @pytest.fixture
    def downloader(self, base_data_folder: Path) -> HttpFileDownloader:
        """Fixture for the HttpFileDownloader instance."""
        return HttpFileDownloader(base_data_folder)

    @responses.activate
    def test_download_success(
        self,
        downloader: HttpFileDownloader,
        file_metadata: FileMetadata,
        base_data_folder: Path,
    ):
        # Given: A valid URL that returns a successful response
        url = file_metadata.url
        file_content = b"test data"
        responses.add(responses.GET, url, body=file_content, status=200)

        # When: The download method is called
        result_path = downloader.download(file_metadata)

        # Then: The file is downloaded correctly
        expected_path = (
            base_data_folder / file_metadata.url_hash / f"raw.{file_metadata.format}"
        )
        assert result_path == expected_path
        assert result_path.read_bytes() == file_content
        assert len(responses.calls) == 1
        assert responses.calls[0].request.url == url

    def test_download_file_already_exists(
        self,
        downloader: HttpFileDownloader,
        file_metadata: FileMetadata,
        base_data_folder: Path,
    ):
        # Given: The file to download already exists
        expected_path = (
            base_data_folder / file_metadata.url_hash / f"raw.{file_metadata.format}"
        )
        expected_path.parent.mkdir(parents=True, exist_ok=True)
        expected_path.write_text("existing content")

        # When: The download method is called
        result_path = downloader.download(file_metadata)

        # Then: The existing file path is returned without a new download
        assert result_path == expected_path
        assert result_path.read_text() == "existing content"

    @responses.activate
    def test_download_http_error(
        self, downloader: HttpFileDownloader, file_metadata: FileMetadata
    ):
        # Given: A URL that returns an HTTP error
        url = file_metadata.url
        responses.add(responses.GET, url, status=404)

        # When: The download method is called
        result_path = downloader.download(file_metadata)

        # Then: The download fails and None is returned
        assert result_path is None

    @patch("requests.get")
    def test_download_request_exception(
        self,
        mock_get: MagicMock,
        downloader: HttpFileDownloader,
        file_metadata: FileMetadata,
    ):
        # Given: A request that raises a RequestException
        mock_get.side_effect = requests.exceptions.RequestException("Connection error")

        # When: The download method is called
        result_path = downloader.download(file_metadata)

        # Then: The download fails and None is returned
        assert result_path is None

    @patch("requests.get")
    def test_download_unexpected_exception(
        self,
        mock_get: MagicMock,
        downloader: HttpFileDownloader,
        file_metadata: FileMetadata,
    ):
        # Given: A request that raises an unexpected exception
        mock_get.side_effect = Exception("Unexpected error")

        # When: The download method is called
        result_path = downloader.download(file_metadata)

        # Then: The download fails and None is returned
        assert result_path is None
