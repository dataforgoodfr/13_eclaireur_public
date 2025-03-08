import pandas as pd
import pytest

from back.scripts.utils.dataframe_operation import (
    expand_json_columns,
    normalize_identifiant,
    safe_rename,
)


@pytest.mark.parametrize(
    "schema_dict, expected_columns",
    [
        ({}, ["a", "b"]),
        ({"a": "x"}, ["x", "b"]),
        ({"a": "x", "b": "y"}, ["x", "y"]),
        (
            {"c": "z"},
            ["a", "b"],
        ),  # if a column does not exist in the DataFrame, it is not raised as an error, but rather ignored
        ({"a": "x", "c": "z"}, ["x", "b"]),
    ],
)
def test_safe_rename(schema_dict, expected_columns):
    inp = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})
    out = safe_rename(inp, schema_dict)
    assert out.columns.tolist() == expected_columns


def test_safe_rename_remove_accents():
    inp = pd.DataFrame({"idBénéficiaire": [1, 2, 3]})
    out = safe_rename(inp, {})
    assert out.columns.tolist() == ["idBeneficiaire"]


class TestNormalizeBeneficiaireIdentifiant:
    def test_no_id(self):
        df = pd.DataFrame({"foo": [1]})
        pd.testing.assert_frame_equal(df, normalize_identifiant(df, "idBeneficiaire"))

    def test_siren(self):
        df = pd.DataFrame({"idBeneficiaire": ["123456789", "123456789", "12345678"]})
        expected_df = pd.DataFrame(
            {"idBeneficiaire": ["12345678900000", "12345678900000", "01234567800000"]}
        )
        pd.testing.assert_frame_equal(expected_df, normalize_identifiant(df, "idBeneficiaire"))

    def test_siret(self):
        df = pd.DataFrame(
            {"idBeneficiaire": ["01234567890001", "01234567890001", "1234567890001"]}
        )
        expected_df = pd.DataFrame({"idBeneficiaire": ["01234567890001"] * 3})
        pd.testing.assert_frame_equal(expected_df, normalize_identifiant(df, "idBeneficiaire"))

    def test_no_siren_no_siret(self):
        df = pd.DataFrame({"idBeneficiaire": ["123456"]})
        with pytest.raises(RuntimeError, match="is neither siren not siret"):
            normalize_identifiant(df, "idBeneficiaire")

    def test_clean_dot0(self):
        df = pd.DataFrame(
            {"idBeneficiaire": ["01234567890001.0", "01234567890001.0", "1234567890001"]}
        )
        expected_df = pd.DataFrame({"idBeneficiaire": ["01234567890001"] * 3})
        pd.testing.assert_frame_equal(expected_df, normalize_identifiant(df, "idBeneficiaire"))


class TestExpandJsonColumns:
    def test_expand_valid_json(self):
        """Test expand_json_columns with valid JSON data"""
        df = pd.DataFrame(
            {
                "id": [1, 2, 3],
                "extra": [
                    '{"field1": "value1", "field2": 123}',
                    '{"field1": "value2", "field2": 456}',
                    '{"field1": "value3", "field2": 789}',
                ],
            }
        )

        result = expand_json_columns(df)
        expected_df = pd.DataFrame(
            {
                "id": [1, 2, 3],
                "extra": [
                    '{"field1": "value1", "field2": 123}',
                    '{"field1": "value2", "field2": 456}',
                    '{"field1": "value3", "field2": 789}',
                ],
                "extra_field1": ["value1", "value2", "value3"],
                "extra_field2": [123, 456, 789],
            }
        )
        pd.testing.assert_frame_equal(result, expected_df)

    def test_expand_invalid_json(self):
        """Test expand_json_columns with invalid/missing JSON data"""
        df_missing = pd.DataFrame(
            {"id": [1, 2, 3], "extra": ['{"field1": "value1"}', None, "invalid json"]}
        )
        expected_df = pd.DataFrame(
            {
                "id": [1, 2, 3],
                "extra": ['{"field1": "value1"}', None, "invalid json"],
                "extra_field1": ["value1", None, None],
            }
        )

        result_missing = expand_json_columns(df_missing)
        pd.testing.assert_frame_equal(result_missing, expected_df)
