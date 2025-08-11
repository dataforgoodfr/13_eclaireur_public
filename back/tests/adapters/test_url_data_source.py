import hashlib
from pathlib import Path

import pytest

from back.scripts.adapters.url_data_source import UrlDataSource, _sha256
from back.scripts.datasets.entities import FileMetadata


def test_sha256():
    # Given: A string to hash
    s = "hello world"

    # When: The _sha256 function is called
    h = _sha256(s)

    # Then: The hash is correct
    assert h == hashlib.sha256(s.encode("utf-8")).hexdigest()


def test_sha256_with_none():
    # Given: A None value
    s = None

    # When: The _sha256 function is called
    h = _sha256(s)

    # Then: The result is None
    assert h is None


class TestUrlDataSource:
    def test_initialization(self, tmp_path):
        # Given: A path to a dummy CSV file
        csv_path = tmp_path / "test.csv"
        csv_path.touch()

        # When: A UrlDataSource is initialized
        data_source = UrlDataSource(csv_path)

        # Then: The attributes are set correctly
        assert data_source.csv_path == csv_path
        assert data_source.delimiter == ";"

    def test_initialization_file_not_found(self):
        # Given: A path to a non-existent CSV file
        csv_path = Path("non_existent_file.csv")

        # When: A UrlDataSource is initialized
        # Then: A FileNotFoundError is raised
        with pytest.raises(FileNotFoundError):
            UrlDataSource(csv_path)

    def test_get_files(self, tmp_path):
        # Given: A path to a test CSV file
        csv_content = """url;format;extra_col1;extra_col2
http://example.com/file1;pdf;val1;val2
http://example.com/file2;docx;val3;val4
;csv;;
http://example.com/file3;json;val5;
"""
        csv_path = tmp_path / "test.csv"
        csv_path.write_text(csv_content)
        data_source = UrlDataSource(csv_path)

        # When: The get_files method is called
        files = list(data_source.get_files())

        # Then: The correct number of files is returned
        assert len(files) == 3

        # Then: The first file's metadata is correct
        assert files[0] == FileMetadata(
            url="http://example.com/file1",
            format="pdf",
            url_hash=_sha256("http://example.com/file1"),
            extra_data={"extra_col1": "val1", "extra_col2": "val2"},
        )

        # Then: The second file's metadata is correct
        assert files[1] == FileMetadata(
            url="http://example.com/file2",
            format="docx",
            url_hash=_sha256("http://example.com/file2"),
            extra_data={"extra_col1": "val3", "extra_col2": "val4"},
        )

        # Then: The third file's metadata is correct
        assert files[2] == FileMetadata(
            url="http://example.com/file3",
            format="json",
            url_hash=_sha256("http://example.com/file3"),
            extra_data={"extra_col1": "val5", "extra_col2": ""},
        )
