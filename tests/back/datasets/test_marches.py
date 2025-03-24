from back.scripts.datasets.marches import MarchesPublicsWorkflow
import json
import os


nested_json = {
    "marches": {
        "marche": [
            {
                "id": "01",
                "acheteur": {"id": "a_01"},
                "montant": 500.0,
                "titulaires": [{"titulaire": {"typeIdentifiant": "SIRET", "id": "id_1"}}],
            },
            {
                "id": "02",
                "acheteur": {"id": "a_02"},
                "montant": 12.78,
                "titulaires": [{"titulaire": {"typeIdentifiant": "SIRET", "id": "id_2"}}],
            },
        ]
    }
}

direct_json = {
    "marches": [
        {
            "id": "01",
            "acheteur": {"id": "a_01"},
            "montant": 500.0,
            "titulaires": [{"titulaire": {"typeIdentifiant": "SIRET", "id": "id_1"}}],
        },
        {
            "id": "02",
            "acheteur": {"id": "a_02"},
            "montant": 12.78,
            "titulaires": [{"titulaire": {"typeIdentifiant": "SIRET", "id": "id_2"}}],
        },
    ]
}


def test_direct_json_structure():
    with open("test.json", "w") as f:
        json.dump(direct_json, f)
    assert MarchesPublicsWorkflow.check_json_structure("test.json") == "direct"
    os.remove("test.json")


def test_nested_json_structure():
    with open("test.json", "w") as f:
        json.dump(nested_json, f)
    assert MarchesPublicsWorkflow.check_json_structure("test.json") == "nested"
    os.remove("test.json")
