import pandas as pd

from back.scripts.loaders.json_loader import JSONLoader
from back.scripts.loaders.zip_loader import ZipLoader


def test_zip_loader():
    loader = ZipLoader(
        file_url="tests/back/loaders/fixtures/OD.SUBVENTION_CONVENTION_CODAH.json.zip"
    )
    expected_loader = JSONLoader("tests/back/loaders/fixtures/test_zip_loader.json")
    pd.testing.assert_frame_equal(loader.load(), expected_loader.load())


class Test_loader_class_resolver_from_url:
    def test_find_json_with_extension(self):
        loader = ZipLoader(file_url="https://example.com/data/test.json.zip")
        assert loader._loader_class_resolver_from_url() is JSONLoader

    def test_find_json_with_path(self):
        loader = ZipLoader(file_url="https://example.com/data/json/test.zip")
        assert loader._loader_class_resolver_from_url() is JSONLoader

    def test_no_match(self):
        loader = ZipLoader(file_url="https://example.com/data/toto/test.zip")
        assert loader._loader_class_resolver_from_url() is None

    def test_multiple_matches(self):
        loader = ZipLoader(file_url="https://example.com/data/json/csv/test.zip")
        assert loader._loader_class_resolver_from_url() is None


class Test_get_archive_prefix:
    def test_find_json_with_extension(self):
        loader = ZipLoader(file_url="https://example.com/data/test.json.zip")
        assert loader.get_archive_prefix() == "test.json"

    def test_find_json_with_path(self):
        loader = ZipLoader(file_url="https://example.com/data/json/test.zip")
        assert loader.get_archive_prefix() == "test"
