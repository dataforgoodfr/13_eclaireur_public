import os
from pathlib import Path

import pandas as pd
import pandas.testing as pdtesting

from back.scripts.datasets.marches import MarchesPublicsWorkflow
from back.scripts.utils.config_manager import ConfigManager

FIXTURES_DIRECTORY = Path(__file__).parent / "fixtures"
CONFIG_TEST_FILEPATH = "back/config-test.yaml"

config = ConfigManager.load_config(CONFIG_TEST_FILEPATH)


def test_direct_json_structure():
    assert (
        MarchesPublicsWorkflow.check_json_structure(FIXTURES_DIRECTORY / "marche_direct.json")
        == "marches"
    )


def test_nested_json_structure():
    assert (
        MarchesPublicsWorkflow.check_json_structure(FIXTURES_DIRECTORY / "marche_nested.json")
        == "marches.marche"
    )


def test_marches_public_dataframes():
    mp = MarchesPublicsWorkflow.from_config(config)

    # Direct marche test
    direct_df = mp._read_parse_file(
        file_metadata=None, raw_filename=FIXTURES_DIRECTORY / "marche_direct.json"
    )

    assert direct_df.shape == (2, 5)
    assert "acheteur_id" in direct_df.columns
    assert "a_02" in direct_df["acheteur_id"].tolist()
    assert "titulaires" in direct_df.columns
    assert "[{'typeIdentifiant': 'SIRET', 'id': 'id_1'}]" in direct_df["titulaires"].to_list()
    pdtesting.assert_series_equal(
        direct_df["montant"], pd.Series([500, 40], name="montant")
    )
    pdtesting.assert_series_equal(
        direct_df["countTitulaires"], pd.Series([1, 2], name="countTitulaires")
    )
    # Remove the interim.json file created by mp workflow
    os.remove(FIXTURES_DIRECTORY / "interim.json")

    # Nested marche test
    nested_df = mp._read_parse_file(
        file_metadata=None, raw_filename=FIXTURES_DIRECTORY / "marche_nested.json"
    )
    assert nested_df.shape == (2, 5)
    assert "acheteur_id" in nested_df.columns
    assert "a_02" in nested_df["acheteur_id"].tolist()
    assert "titulaires" in nested_df.columns
    assert "[{'typeIdentifiant': 'SIRET', 'id': 'id_1'}]" in nested_df["titulaires"].to_list()
    pdtesting.assert_series_equal(
        nested_df["montant"], pd.Series([200, 20], name="montant")
    )
    pdtesting.assert_series_equal(
        nested_df["countTitulaires"], pd.Series([1, 2], name="countTitulaires")
    )
    # Remove the interim.json file created by mp workflow
    os.remove(FIXTURES_DIRECTORY / "interim.json")
