from back.scripts.datasets.marches import MarchesPublicsWorkflow
from pathlib import Path
from back.scripts.utils.config_manager import ConfigManager
import os

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
    assert direct_df.shape == (3, 5)
    assert "acheteur_id" in direct_df.columns
    assert "a_02" in direct_df["acheteur_id"].tolist()
    assert "titulaire_id" in direct_df.columns
    assert "id_3" in direct_df["titulaire_id"].tolist()
    assert direct_df["montant"].sum() == 540
    # Remove the interim.json file created by mp workflow
    os.remove(FIXTURES_DIRECTORY / "interim.json")

    # Nested marche test
    nested_df = mp._read_parse_file(
        file_metadata=None, raw_filename=FIXTURES_DIRECTORY / "marche_nested.json"
    )
    assert nested_df.shape == (3, 5)
    assert "acheteur_id" in nested_df.columns
    assert "a_02" in nested_df["acheteur_id"].tolist()
    assert "titulaire_id" in nested_df.columns
    assert "id_3" in nested_df["titulaire_id"].tolist()
    assert nested_df["montant"].sum() == 220
    # Remove the interim.json file created by mp workflow
    os.remove(FIXTURES_DIRECTORY / "interim.json")
