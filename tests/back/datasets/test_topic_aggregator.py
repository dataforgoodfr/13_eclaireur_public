import os
import tempfile
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from back.scripts.datasets.topic_aggregator import TopicAggregator

FIXTURES_PATH = Path(__file__).parent / "fixtures"


class TestTopicAggregator:
    def setup_method(self):
        self.path = tempfile.TemporaryDirectory()
        self.config = {
            "data_folder": self.path.name,
            "combined_filename": os.path.join(self.path.name, "final.parquet"),
        }
        self.raw_filename = Path(self.path.name) / "raw.csv"
        self.files_in_scope = pd.DataFrame(
            {
                "url": ["file:" + str(self.raw_filename)],
                "format": "csv",
                "siren": "123456789",
                "type": "COM",
            }
        )

    def teardown_method(self):
        self.path.cleanup()

    def test_perfect_file(self):
        inp = pd.DataFrame(
            {
                "nomAttribuant": "Métropole de Lyon (Budget principal)",
                "idAttribuant": "20004697700019",
                "dateConvention": "2023-11-09",
                "nomBeneficiaire": ["124 SERVICES", "WHATEVER"],
                "idBeneficiaire": ["47785695900010", "47787695900010"],
                "objet": "124 SERVICES_GSUP 2022_LYON_SOLDE_SM",
                "montant": [4500, 120],
                "nature": "aide en numéraire",
                "conditionsVersement": "unique",
                "datesPeriodeVersement": "2023-11-09",
                "idRAE": None,
                "notificationUE": "non",
                "pourcentageSubvention": 1
            }
        )
        inp.to_csv(self.raw_filename, index=False)
        aggregator = TopicAggregator(
            files_in_scope=self.files_in_scope,
            topic="subventions",
            datafile_loader_config=self.config,
        )
        print(f"Vérification de la sortie : {self.config['combined_filename']}")

        aggregator.run()
        out = pd.read_parquet(self.config["combined_filename"])
        print(f"Contenu du fichier Parquet : \n{out}")
        expected = pd.DataFrame(
            {
                "nom_attribuant": "Métropole de Lyon (Budget principal)",
                "id_attribuant": "20004697700019",
                "date_convention": pd.to_datetime("2023-11-09", utc=True),
                "nom_beneficiaire": ["124 SERVICES", "WHATEVER"],
                "id_beneficiaire": ["47785695900010", "47787695900010"],
                "objet": "124 SERVICES_GSUP 2022_LYON_SOLDE_SM",
                "montant": [4500.0, 120],
                "nature": "aide en numéraire",
                "conditions_versement": "unique",
                "dates_periode_versement": "2023-11-09",
                "id_rae": None,
                "notification_ue": "non",
                "pourcentage_subvention": "1",
                "topic": "subventions",
                "url": "file:" + str(self.raw_filename),
                "coll_type": "COM",
                "annee": np.int32(2023),
            }
        )
        pd.testing.assert_frame_equal(out, expected)

    @pytest.mark.skip(reason="Need to implement a system to reinject siren")
    def test_minimal_benef_only(
        self,
    ):
        inp = pd.DataFrame(
            {
                "raison_sociale": ["A", "B"],
                "siret": ["12345678901234", "12345678987094"],
                "total_montant_en_euros": [5, 100],
            }
        )
        inp.to_csv(self.raw_filename, index=False)
        aggregator = TopicAggregator(
            files_in_scope=self.files_in_scope,
            topic="subventions",
            datafile_loader_config=self.config,
        )

        aggregator.run()

        out = pd.read_parquet(self.config["combined_filename"])
        expected = pd.DataFrame(
            {
                "nomBeneficiaire": ["A", "B"],
                "idBeneficiaire": ["12345678901234", "12345678987094"],
                "montant": [5.0, 100],
                "topic": "test_topic",
                "url": "file:" + str(self.raw_filename),
                "coll_type": "COM",
                "idAttribuant": "12345678900000",
            }
        )
        pd.testing.assert_frame_equal(out, expected)
