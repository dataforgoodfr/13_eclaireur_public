import pandas as pd
import pytest

from back.scripts.utils.dataframe_operation import safe_rename


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
