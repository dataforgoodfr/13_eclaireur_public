import os
import tempfile
from pathlib import Path

import pandas as pd

from back.scripts.datasets.datagouv_searcher import (
    DataGouvSearcher,
    remove_same_dataset_formats,
)

FIXTURES_PATH = Path(__file__).parent / "fixtures"


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
                    "http://www.data.rennes-metropole.fr/fileadmin/user_upload/data/vdr_budget_v3/CA_2011_Open_DATA_Subventions_d_equipement.xls",
                    "https://data.grandpoitiers.fr/explore/dataset/citoyennete-subventions-directes-attribuees-aux-associations-2017-ville-de-poiti/download?format=json",
                    "https://example.com/json",
                    "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/subventions-aux-associations-votees-copie1/exports/json",
                ],
                "format": ["xls", "json", "json", "json"],
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


class TestDataGouvSearch:
    def setup_method(self):
        self.path = tempfile.TemporaryDirectory()

        self.datagouv_catalog = os.path.join(self.path.name, "datagouv_atalog.parquet")
        self.main_config = {
            "datagouv_search": {
                "data_folder": self.path.name,
                "combined_filename": os.path.join(self.path.name, "final.parquet"),
                "description_filter": ["association", "subvention"],
                "title_filter": ["association", "subvention"],
            },
            "datagouv_catalog": {"combined_filename": self.datagouv_catalog},
        }

    def teardown_method(self):
        self.path.cleanup()

    def test_search_from_title_desc(self):
        catalog = pd.DataFrame(
            {
                "dataset_title": ["Subventions de Marseille", "2002", "Whatever"],
                "dataset_description": ["", "Dons aux associations de 2022", "Unrelated"],
                "dataset.organization_id": ["1", "2", "3"],
                "id": ["3", "4", "5"],
                "siren": ["111", "222", "333"],
                "format": "csv",
                "url": ["first_url", "second_url", "third_url"],
                "dataset_id": [1, 2, 4],
            }
        )
        catalog.to_parquet(self.datagouv_catalog)

        searcher = DataGouvSearcher(self.main_config)
        searcher.run()

        out = pd.read_parquet(searcher.get_output_path(self.main_config))
        expected = pd.DataFrame(
            {
                "dataset_title": ["Subventions de Marseille", "2002"],
                "dataset_description": ["", "Dons aux associations de 2022"],
                "dataset.organization_id": ["1", "2"],
                "id": ["3", "4"],
                "siren": ["111", "222"],
                "format": "csv",
                "url": ["first_url", "second_url"],
                "dataset_id": [1, 2],
            }
        )
        pd.testing.assert_frame_equal(out, expected)
