import polars as pl
import polars.testing as pltesting

from back.scripts.enrichment.utils.cpv_utils import CPVUtils


class TestCPVUtils:
    def test_extract_sub_cpv_exactly_level_2(self):
        cpvs = pl.Series(
            ["11000000", "11000000-0", "11100000", "11100000-0", "1100000", "1100000-0"]
        )
        expected = pl.Series(["11", "11", None, None, None, None])
        actual = cpvs.map_elements(
            lambda ser: CPVUtils._extract_sub_cpv(
                ser, pattern=CPVUtils._CPV_EXACTLY_LEVEL_2_PATTERN
            )
        )
        pltesting.assert_series_equal(actual, expected)

    def test_extract_sub_cpv_level_2(self):
        cpvs = pl.Series(
            ["11000000", "11000000-0", "11100000", "11100000-0", "1100000", "1100000-0"]
        )
        expected = pl.Series(["11", "11", "11", "11", None, None])
        actual = cpvs.map_elements(
            lambda ser: CPVUtils._extract_sub_cpv(ser, pattern=CPVUtils._CPV_LEVEL_2_PATTERN)
        )
        pltesting.assert_series_equal(actual, expected)

    def test_extract_sub_cpv_level_8(self):
        cpvs = pl.Series(
            ["11000000", "11000000-0", "11100000", "11100000-0", "1100000", "1100000-0"]
        )
        expected = pl.Series(["11000000", "11000000", "11100000", "11100000", None, None])
        actual = cpvs.map_elements(
            lambda ser: CPVUtils._extract_sub_cpv(ser, pattern=CPVUtils._CPV_LEVEL_8_PATTERN)
        )
        pltesting.assert_series_equal(actual, expected)

    def test_get_cpv_2_and_8_labels(self):
        cpv_labels = pl.DataFrame(
            {
                "CODE": ["01000000-0", "01100000-0", "02000000-0", "02100000-0"],
                "FR": ["Div 1", "Div 1 group 1", "Div 2", "Div 2 group 1"],
            }
        )
        expected_cpv_2_labels = pl.DataFrame(
            {"cpv_2": ["01", "02"], "cpv_2_label": ["Div 1", "Div 2"]}
        )
        expected_cpv_8_labels = pl.DataFrame(
            {
                "cpv_8": ["01000000", "01100000", "02000000", "02100000"],
                "cpv_8_label": ["Div 1", "Div 1 group 1", "Div 2", "Div 2 group 1"],
            }
        )
        actual_cpv_2_labels, actual_cpv_8_labels = CPVUtils._get_cpv_2_and_8_labels(cpv_labels)
        pltesting.assert_frame_equal(actual_cpv_2_labels, expected_cpv_2_labels)
        pltesting.assert_frame_equal(actual_cpv_8_labels, expected_cpv_8_labels)

    def test_add_cpv_labels(self):
        cpv_labels = pl.DataFrame(
            {
                "CODE": ["01000000-0", "01100000-0", "02000000-0", "02100000-0"],
                "FR": ["Div 1", "Div 1 group 1", "Div 2", "Div 2 group 1"],
            }
        )
        marches = pl.DataFrame(
            {"codeCPV": ["01000000-0", "01100000-0", "02000000-0", "02100000-0"]}
        )
        expected = pl.DataFrame(
            {
                "codeCPV": ["01000000-0", "01100000-0", "02000000-0", "02100000-0"],
                "cpv_2": ["01", "01", "02", "02"],
                "cpv_8": ["01000000", "01100000", "02000000", "02100000"],
                "cpv_2_label": ["Div 1", "Div 1", "Div 2", "Div 2"],
                "cpv_8_label": ["Div 1", "Div 1 group 1", "Div 2", "Div 2 group 1"],
            }
        )
        actual = CPVUtils.add_cpv_labels(marches, cpv_labels)
        pltesting.assert_frame_equal(actual, expected)
