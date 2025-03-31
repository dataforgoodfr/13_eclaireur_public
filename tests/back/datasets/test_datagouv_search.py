import os
import tempfile
from pathlib import Path

import pandas as pd

from back.scripts.datasets.datagouv_searcher import DataGouvSearcher

FIXTURES_PATH = Path(__file__).parent / "fixtures"


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
                "dataset.title": ["Subventions de Marseille", "2002", "Whatever"],
                "dataset.description": ["", "Dons aux associations de 2022", "Unrelated"],
                "dataset.organization_id": ["1", "2", "3"],
                "id": ["3", "4", "5"],
                "siren": ["111", "222", "333"],
            }
        )
        catalog.to_parquet(self.datagouv_catalog)

        searcher = DataGouvSearcher(self.main_config)
        searcher.run()

        out = pd.read_parquet(searcher.get_output_path(self.main_config))
        expected = pd.DataFrame(
            {
                "dataset.title": ["Subventions de Marseille", "2002"],
                "dataset.description": ["", "Dons aux associations de 2022"],
                "dataset.organization_id": ["1", "2"],
                "id": ["3", "4"],
                "siren": ["111", "222"],
            }
        )
        pd.testing.assert_frame_equal(out, expected)
