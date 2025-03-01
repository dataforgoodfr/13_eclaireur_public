import pandas as pd
import pytest

from back.scripts.utils.dataframe_operation import normalize_identifiant, safe_rename


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
