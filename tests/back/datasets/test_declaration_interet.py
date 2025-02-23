from pathlib import Path

from bs4 import BeautifulSoup

from back.scripts.datasets.declaration_interet import DeclaInteretWorkflow
from tests.back.datasets.fixtures.expected_parsed import EXPECTED


def test_parse_declaration():
    with open(Path(__file__).parent / "fixtures" / "declaration.xml") as f:
        soup = BeautifulSoup(f.read(), features="xml").find("declaration")
        out = DeclaInteretWorkflow.parse_declaration(soup)
        assert out[0] == EXPECTED[0]
