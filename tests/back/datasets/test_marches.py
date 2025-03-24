from back.scripts.datasets.marches import MarchesPublicsWorkflow
import os
from pathlib import Path


FIXTURES_DIRECTORY = Path(__file__).parent / "fixtures"


def test_direct_json_structure():
    assert (
        MarchesPublicsWorkflow.check_json_structure(
            os.path.join(FIXTURES_DIRECTORY, "marche_direct.json")
        )
        == "direct"
    )


def test_nested_json_structure():
    assert (
        MarchesPublicsWorkflow.check_json_structure(
            os.path.join(FIXTURES_DIRECTORY, "marche_nested.json")
        )
        == "nested"
    )
