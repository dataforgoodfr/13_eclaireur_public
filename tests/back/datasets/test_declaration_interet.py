import filecmp
import tempfile
from pathlib import Path

import pandas as pd
from bs4 import BeautifulSoup

from back.scripts.datasets.declaration_interet import DeclaInteretWorkflow

FIXTURES_DIRECTORY = Path(__file__).parent / "fixtures"


def test_parse_declaration():
    with open(Path(__file__).parent / "fixtures" / "declaration.xml") as f:
        soup = BeautifulSoup(f.read(), features="xml").find("declaration")
        out = pd.DataFrame(DeclaInteretWorkflow._parse_declaration(soup))

    with tempfile.TemporaryDirectory() as tmpdirname:
        out_filename = Path(tmpdirname) / "complete_decla.csv"
        out.to_csv(out_filename, index=False)

        exp_filename = FIXTURES_DIRECTORY / "complete_decla.csv"
        assert filecmp.cmp(str(out_filename), str(exp_filename))


class TestParseMandat:
    def test_parse_mandat_revenus(self):
        with open(FIXTURES_DIRECTORY / "mandat_revenus_0.xml") as f:
            soup = BeautifulSoup(f.read(), features="xml").find("declaration")

        out = DeclaInteretWorkflow._parse_mandat_revenues(soup)
        out = pd.DataFrame(out)

        exp = pd.read_csv(
            FIXTURES_DIRECTORY / "exp_mandat_revenus_0.csv",
            sep=";",
            dtype={"description": str, "description_mandat": str},
            parse_dates=["date_remuneration"],
        )
        pd.testing.assert_frame_equal(out, exp)

    def test_parse_mandat_revenus_emtpy(self):
        with open(FIXTURES_DIRECTORY / "mandat_revenus_empty.xml") as f:
            soup = BeautifulSoup(f.read(), features="xml").find("declaration")

        out = DeclaInteretWorkflow._parse_mandat_revenues(soup)
        assert not out

    def test_parse_mandat_revenus_emtpy2(self):
        with open(FIXTURES_DIRECTORY / "mandat_revenus_empty2.xml") as f:
            soup = BeautifulSoup(f.read(), features="xml").find("declaration")

        out = DeclaInteretWorkflow._parse_mandat_revenues(soup)
        assert not out

    def test_parse_mandat_revenus_com_only(self):
        with open(FIXTURES_DIRECTORY / "mandat_revenus_com_only.xml") as f:
            soup = BeautifulSoup(f.read(), features="xml").find("declaration")

        out = DeclaInteretWorkflow._parse_mandat_revenues(soup)
        exp = {
            "description": None,
            "commentaire": "186 euros par mois",
            "remuneration_brut_net": None,
            "description_mandat": "conseilère communautaire",
        }
        assert out[0] == exp

    def test_parse_mandat_revenus_when_info_outside_of_item(self):
        with open(FIXTURES_DIRECTORY / "mandat_revenus_inversion.xml") as f:
            soup = BeautifulSoup(f.read(), features="xml").find("declaration")

        out = DeclaInteretWorkflow._parse_mandat_revenues(soup)
        exp = {
            "description": None,
            "commentaire": None,
            "remuneration_brut_net": None,
            "description_mandat": "Maire",
        }
        assert out[0] == exp
