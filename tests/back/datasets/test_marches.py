from back.scripts.datasets.marches import MarchesPublicsWorkflow
from pathlib import Path


FIXTURES_DIRECTORY = Path(__file__).parent / "fixtures"


def test_direct_json_structure():
    assert (
        MarchesPublicsWorkflow.check_json_structure(FIXTURES_DIRECTORY / "marche_direct.json")
        == "direct"
    )


def test_nested_json_structure():
    assert (
        MarchesPublicsWorkflow.check_json_structure(FIXTURES_DIRECTORY / "marche_nested.json")
        == "nested"
    )
