import pandas as pd
import pytest

from back.scripts.utils.config import project_config
from back.scripts.utils.geolocator import GeoLocator, GeoTypeEnum

config = project_config["communities"]["geolocator"]


class TestCleanDF:
    @pytest.fixture
    def geoloc(self):
        yield GeoLocator(config)

    def test_get_geo_type_url(self, geoloc):
        for geo_type in GeoTypeEnum:
            assert geo_type.value in geoloc.get_geo_type_url(geo_type)

    def test_get_geo_type_url_error(self, geoloc):
        with pytest.raises(ValueError):
            geoloc.get_geo_type_url("unknown")

    def test_convert_to_string(self, geoloc):
        # Given
        geo_type = GeoTypeEnum.DEP
        df = pd.DataFrame({geo_type.code_name: [1, 2, 3]})

        # When
        result = geoloc.clean_df(df, geo_type)

        # Then
        dtype = result[geo_type.code_name].dtype
        expected_dtype = "object"
        assert dtype == expected_dtype

    def test_normalize_siren_dtype(self, geoloc):
        # Given
        geo_type = GeoTypeEnum.COM
        df = pd.DataFrame({"siren": [123456789, 987654321], geo_type.code_name: [1, 2]})

        # When
        result = geoloc.clean_df(df, geo_type)

        # Then
        dtype = result["siren"].dtype
        expected_dtype = "object"
        assert dtype == expected_dtype

    def test_normalize_siren_value(self, geoloc):
        # Given
        geo_type = GeoTypeEnum.COM
        df = pd.DataFrame({"siren": [123456789, 987654321], geo_type.code_name: [1, 2]})

        # When
        result = geoloc.clean_df(df, geo_type)

        # Then
        value = result["siren"].iloc[0]
        expected_value = "123456789"
        assert value == expected_value
