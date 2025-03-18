import pandas as pd

from back.scripts.loaders import JSONLoader, ZipLoader


def test_zip_loader():
    data = ZipLoader(
        file_url="tests/back/loaders/fixtures/OD.SUBVENTION_CONVENTION_CODAH.json.zip"
    )
    expected_data = JSONLoader("tests/back/loaders/fixtures/test_zip_loader.json")
    pd.testing.assert_frame_equal(data.load(), expected_data.load())


class Test_loader_class_resolver_from_url:
    def test_find_json(self):
        data = ZipLoader(file_url="https://example.com/data/json/test.zip")
        assert data._loader_class_resolver_from_url() is JSONLoader

    def test_no_match(self):
        data = ZipLoader(file_url="https://example.com/data/toto/test.zip")
        assert data._loader_class_resolver_from_url() is None

    def test_multiple_matches(self):
        data = ZipLoader(file_url="https://example.com/data/json/csv/test.zip")
        assert data._loader_class_resolver_from_url() is None
