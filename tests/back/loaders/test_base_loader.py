import re

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
        responses.add(
            responses.HEAD,
            url,
            status=404,
            content_type="text/csv",
        )

        file_media_type = BaseLoader.get_file_media_type(url)
        assert file_media_type == ""

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
