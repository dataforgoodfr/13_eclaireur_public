import pandas as pd

from back.scripts.datasets.datagouv_searcher import remove_same_dataset_formats


class TestRemoveSameDatasetFormats:
    def test_remove_same_dataset_formats(self):
        df = pd.DataFrame(
            {
                "url": [
                    "https://example.com/json",
                    "https://example.com/csv",
                    "http://www.data.rennes-metropole.fr/fileadmin/user_upload/data/vdr_budget_v3/CA_2011_Open_DATA_Subventions_d_equipement.csv",
                    "http://www.data.rennes-metropole.fr/fileadmin/user_upload/data/vdr_budget_v3/CA_2011_Open_DATA_Subventions_d_equipement.xls",
                    "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/subventions-aux-associations-votees-copie1/exports/json",
                    "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/subventions-aux-associations-votees-copie1/exports/csv?use_labels=true",
                    "https://data.grandpoitiers.fr/explore/dataset/citoyennete-subventions-directes-attribuees-aux-associations-2017-ville-de-poiti/download?format=json",
                    "https://data.grandpoitiers.fr/explore/dataset/citoyennete-subventions-directes-attribuees-aux-associations-2017-ville-de-poiti/download?format=csv",
                ],
                "format": ["json", "csv", "csv", "xls", "json", "csv", "json", "csv"],
                "dataset_id": 1,
            }
        )
        out = remove_same_dataset_formats(df).reset_index(drop=True)
        expected = pd.DataFrame(
            {
                "url": [
                    "http://www.data.rennes-metropole.fr/fileadmin/user_upload/data/vdr_budget_v3/CA_2011_Open_DATA_Subventions_d_equipement.csv",
                    "https://data.grandpoitiers.fr/explore/dataset/citoyennete-subventions-directes-attribuees-aux-associations-2017-ville-de-poiti/download?format=csv",
                    "https://example.com/csv",
                    "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/subventions-aux-associations-votees-copie1/exports/csv?use_labels=true",
                ],
                "format": "csv",
                "dataset_id": 1,
            }
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

    def test_with_fake_formats(self):
        df = pd.DataFrame(
            {
                "url": ["https://example.csv", "https://example.zipo"],
                "format": ["zip", "csv"],
                "dataset_id": 1,
            }
        )
        out = remove_same_dataset_formats(df).reset_index(drop=True)
        pd.testing.assert_frame_equal(out, df)

    def test_with_none_format(self):
        df = pd.DataFrame(
            {
                "url": ["https://example.csv", "https://example2"],
                "format": ["zip", None],
                "dataset_id": 1,
            }
        )
        out = remove_same_dataset_formats(df).reset_index(drop=True)
        pd.testing.assert_frame_equal(out, df)
