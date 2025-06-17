import re

import pytest
import responses

from back.scripts.loaders import BaseLoader as BaseLoaderBase


class BaseLoader(BaseLoaderBase):
    file_extensions = None
    file_media_type_regex = None


class TestBaseLoader:
    def test_get_file_is_url(self):
        is_url = BaseLoader.get_file_is_url("http://example.com")
        assert is_url is True

        is_url = BaseLoader.get_file_is_url("file://example.com")
        assert is_url is False

        is_url = BaseLoader.get_file_is_url("/path/to/file.csv")
        assert is_url is False

    def test_get_file_extension(self):
        extension = BaseLoader.get_file_extension("file://example.com/file.csv")
        assert extension == "csv"

        extension = BaseLoader.get_file_extension("/path/to/file.csv")
        assert extension == "csv"

        extension = BaseLoader.get_file_extension("/path/to/file")
        assert extension == ""

        extension = BaseLoader.get_file_extension("http://example.com")
        assert extension == ""

    def test_can_load_file_extension(self):
        class BaseLoaderFakeCsv(BaseLoader):
            file_extensions = {"csv"}

        class BaseLoaderFakeNoCsv(BaseLoader):
            file_extensions = {"no_csv"}

        can_load = BaseLoader.can_load_file_extension("csv")
        assert can_load is False

        can_load = BaseLoaderFakeCsv.can_load_file_extension("csv")
        assert can_load is True

        can_load = BaseLoaderFakeNoCsv.can_load_file_extension("csv")
        assert can_load is False

    def test_can_load_file_media_type(self):
        class BaseLoaderFakeCsv(BaseLoader):
            file_media_type_regex = r"csv"

        class BaseLoaderFakeCsvWithRe(BaseLoader):
            file_media_type_regex = re.compile(r"csv")

        class BaseLoaderFakeNoCsv(BaseLoader):
            file_media_type_regex = r"no_csv"

        class BaseLoaderFakeJson(BaseLoader):
            file_media_type_regex = r"json"

        can_load = BaseLoader.can_load_file_media_type("csv")
        assert can_load is False

        can_load = BaseLoaderFakeCsv.can_load_file_media_type("csv")
        assert can_load is True

        can_load = BaseLoaderFakeCsvWithRe.can_load_file_media_type("csv")
        assert can_load is True

        can_load = BaseLoaderFakeNoCsv.can_load_file_media_type("csv")
        assert can_load is False

        can_load = BaseLoaderFakeCsv.can_load_file_media_type("file:///srv/udata/ftype/csv")
        assert can_load is True

        can_load = BaseLoaderFakeJson.can_load_file_media_type("csv")
        assert can_load is False

        can_load = BaseLoaderFakeJson.can_load_file_media_type("3gppHalForms+json")
        assert can_load is True

    @responses.activate
    def test_get_file_media_type_200(self):
        file_media_type = BaseLoader.get_file_media_type("file://example.com/file.csv")
        assert file_media_type == ""

        url = "https://example.com/file.csv"
        responses.add(
            responses.HEAD,
            url,
            status=200,
            content_type="text/csv",
        )

        file_media_type = BaseLoader.get_file_media_type(url)
        assert file_media_type == "text/csv"

    @responses.activate
    def test_get_file_media_type_404(self):
        url = "https://example.com/file.csv"
        responses.add(responses.HEAD, url, status=404)

        with pytest.raises(RuntimeError):
            BaseLoader.get_file_media_type(url)

    @responses.activate
    def test_can_load_file(self):
        class BaseLoaderFakeCsv(BaseLoader):
            file_media_type_regex = r"csv"

        class BaseLoaderFakeParquetExtension(BaseLoader):
            file_extensions = {"parquet"}

        class BaseLoaderFakeNoCsv(BaseLoader):
            file_media_type_regex = r"no_csv"

        can_load = BaseLoaderFakeParquetExtension.can_load_file(
            "back/data/geoloc/dep_reg_centers.parquet"
        )
        assert can_load is True

        can_load = BaseLoaderFakeParquetExtension.can_load_file(
            "back/data/geoloc/dep_reg_centers.json"
        )
        assert can_load is False

        url = "https://example.com/file.csv"
        responses.add(
            responses.HEAD,
            url,
            status=200,
            content_type="text/csv",
        )

        can_load = BaseLoader.can_load_file(url)
        assert can_load is False

        can_load = BaseLoaderFakeCsv.can_load_file(url)
        assert can_load is True

        can_load = BaseLoaderFakeNoCsv.can_load_file(url)
        assert can_load is False

    @responses.activate
    def test_unsupported_file_url_force(self):
        # TODO: install pytest-mock
        loader_url = BaseLoader("https://example.com/file.csv")
        expected_data = "its working"
        loader_url.can_load_file = lambda _: False
        loader_url.process_data = lambda _: expected_data

        responses.add(responses.GET, loader_url.file_url, status=200)

        with pytest.raises(RuntimeError):
            loader_url.load(force=False)
        assert loader_url.load(force=True) == expected_data

    def test_empty_file_url(self):
        loader_file = BaseLoader("")
        with pytest.raises(RuntimeError):
            loader_file.load()


class TestBaseLoaderLoadUrl:
    @pytest.fixture
    def loader_url(self):
        yield BaseLoader("https://example.com/file.csv")

    @responses.activate
    def test_remote_file_loading_200(self, loader_url):
        loader_url.process_data = lambda _: "processed_data"
        responses.add(
            responses.GET,
            loader_url.file_url,
            body="processed_data",
            status=200,
        )

        result = loader_url._load_from_url()
        assert result == "processed_data"

    @responses.activate
    def test_remote_file_loading_non_200(self, loader_url):
        responses.add(
            responses.GET,
            loader_url.file_url,
            status=404,
        )
        with pytest.raises(RuntimeError):
            loader_url._load_from_url()


class TestBaseLoaderLoadFile:
    @pytest.fixture
    def loader_file(self):
        yield BaseLoader("file_url")

    def test_wrong_file_url(self, loader_file):
        loader_file.file_url = "null/test"
        assert loader_file._load_from_file() is None

    def test_file_loading(self, loader_file):
        loader_file._load_from_file = lambda: "data"
        result = loader_file._load_from_file()
        assert result == "data"

    def test_local_file_loading(self):
        class BaseLoaderLocalFile(BaseLoader):
            def process_data(self, data):
                return data.decode("utf-8")

        loader_file = BaseLoaderLocalFile("./tests/back/loaders/fixtures/test_loader_file.txt")
        assert loader_file._load_from_file() == "testsucceded"
