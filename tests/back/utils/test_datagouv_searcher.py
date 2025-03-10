import pandas as pd

from back.scripts.datasets.datagouv_searcher import remove_same_dataset_formats


class TestRemoveSameDatasetFormats:
    def test_remove_same_dataset_formats(self):
        df = pd.DataFrame(
            {
                "url": ["https://example.com/json", "https://example.com/csv"],
                "format": ["json", "csv"],
                "dataset_id": 1,
            }
        )
        out = remove_same_dataset_formats(df).reset_index(drop=True)
        expected = pd.DataFrame(
            {"url": ["https://example.com/csv"], "format": ["csv"], "dataset_id": 1}
        ).reset_index(drop=True)
        pd.testing.assert_frame_equal(out, expected)

    def test_remove_same_dataset_with_different_url(self):
        df = pd.DataFrame(
            {
                "url": ["https://example.com/id0/json", "https://example.com/id1/csv"],
                "format": ["json", "csv"],
                "dataset_id": 1,
            }
        )
        out = remove_same_dataset_formats(df)
        pd.testing.assert_frame_equal(out, df)
