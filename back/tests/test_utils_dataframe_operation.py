import numpy as np
import pandas as pd

from back.scripts.utils.dataframe_operation import merge_duplicate_columns


class TestMergeDuplicateColumns:
    def test_no_duplicate_columns(self):
        df = pd.DataFrame([[1, 2], [4, 5]], columns=["A", "B"])
        result = merge_duplicate_columns(df)

        pd.testing.assert_frame_equal(result, df)

    def test_no_duplicate_columns_with_int_column_name(self):
        df = pd.DataFrame([[1, 2], [4, 5]], columns=[1, 2])
        result = merge_duplicate_columns(df)

        pd.testing.assert_frame_equal(result, df)

    def test_duplicate_columns(self):
        df = pd.DataFrame([[1, 2], [3, 4], [5, 6]], columns=["A", "A"])
        result = merge_duplicate_columns(df, separator=" / ")

        expected_df = pd.DataFrame([["1 / 2"], ["3 / 4"], ["5 / 6"]], columns=["A"])

        pd.testing.assert_frame_equal(result, expected_df)

    def test_duplicate_columns_with_separator(self):
        df = pd.DataFrame([[1, 2], [3, 4], [5, 6]], columns=["A", "A"])
        result = merge_duplicate_columns(df, separator="|")

        expected_df = pd.DataFrame([["1|2"], ["3|4"], ["5|6"]], columns=["A"])

        pd.testing.assert_frame_equal(result, expected_df)

    def test_multiple_duplicate_columns(self):
        df = pd.DataFrame(
            [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15]],
            columns=["A", 4, "A", 4, 4],
        )
        result = merge_duplicate_columns(df, separator=" / ")

        expected_df = pd.DataFrame(
            [["1 / 3", "2 / 4 / 5"], ["6 / 8", "7 / 9 / 10"], ["11 / 13", "12 / 14 / 15"]],
            columns=["A", 4],
        )

        pd.testing.assert_frame_equal(result, expected_df)

    def test_nan_values_in_duplicate_columns(self):
        df = pd.DataFrame([[1, np.nan], [4, 2.0]], columns=["A", "A"])
        result = merge_duplicate_columns(df, separator=" / ")

        expected_df = pd.DataFrame([["1.0"], ["4.0 / 2.0"]], columns=["A"])

        pd.testing.assert_frame_equal(result, expected_df)
