import numpy as np
import pandas as pd

from back.scripts.utils.dataframe_operation import merge_duplicate_columns


class TestMergeDuplicateColumns:
    def test_no_duplicate_columns(self):
        df = pd.DataFrame([[1, 2], [4, 5]], columns=["A", "B"])
        result = merge_duplicate_columns(df)
        assert result.equals(df)

    def test_duplicate_columns(self):
        df = pd.DataFrame([[1, 2], [3, 4], [5, 6]], columns=["A", "A"])
        result = merge_duplicate_columns(df, separator=" / ")
        assert result.columns.tolist() == ["A"]
        assert result["A"].tolist() == ["1 / 2", "3 / 4", "5 / 6"]

    def test_duplicate_columns_with_separator(self):
        df = pd.DataFrame([[1, 2], [3, 4], [5, 6]], columns=["A", "A"])
        result = merge_duplicate_columns(df, separator="|")
        assert result.columns.tolist() == ["A"]
        assert result["A"].tolist() == ["1|2", "3|4", "5|6"]

    def test_multiple_duplicate_columns(self):
        df = pd.DataFrame(
            [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15]],
            columns=["A", "B", "A", "B", "B"],
        )
        result = merge_duplicate_columns(df, separator=" / ")
        assert result.columns.tolist() == ["A", "B"]
        assert result["A"].tolist() == ["1 / 3", "6 / 8", "11 / 13"]
        assert result["B"].tolist() == ["2 / 4 / 5", "7 / 9 / 10", "12 / 14 / 15"]

    def test_nan_values_in_duplicate_columns(self):
        df = pd.DataFrame([[1, 2], [4, np.nan]], columns=["A", "A"])
        result = merge_duplicate_columns(df, separator=" / ")
        assert result.columns.tolist() == ["A"]
        assert result["A"].tolist() == ["1.0 / 2.0", "4.0"]
