import logging
import urllib.request
from datetime import datetime
from itertools import chain
from pathlib import Path

import bs4
import pandas as pd
from bs4 import BeautifulSoup
from scripts.utils.config import get_project_base_path
from tqdm import tqdm

PARSED_SECTIONS = ["mandatElectifDto"]
GENERAL_TAGS = [
    "dateDepot",
    "uuid",
    "origine",
    "complete",
    "attachedFiles",
    "general",
    "declarationVersion",
]


class DeclaInteretWorkflow:
    """https://www.data.gouv.fr/fr/datasets/contenu-des-declarations-publiees-apres-le-1er-juillet-2017-au-format-xml/#/resources"""

    def __init__(self, source_folder: Path, is_test: bool = None):
        self.data_folder = Path(source_folder)
        self.data_folder.mkdir(exist_ok=True, parents=True)

        self.xml_filename = self.data_folder / "declarations.xml"
        self.filename = self.data_folder / "declarations.parquet"

        self.url = (
            "file://"
            + str(
                get_project_base_path()
                / "tests"
                / "back"
                / "datasets"
                / "fixtures"
                / "declaration.xml"
            )
            if is_test
            else "https://www.data.gouv.fr/fr/datasets/r/247995fb-3b98-48fd-95a4-2607c8a1de74"
        )

    def _fetch_xml(self):
        if self.xml_filename.exists():
            return
        urllib.request.urlretrieve(self.url, self.xml_filename)

    def run(self):
        self._fetch_xml()
        self._format_to_parquet()

    def _format_to_parquet(self):
        if self.filename.exists():
            return
        with self.xml_filename.open() as f:
            soup = BeautifulSoup(f.read(), features="xml")

        declarations = soup.find_all("declaration")
        df = pd.DataFrame.from_records(
            chain(*[self.parse_declaration(declaration) for declaration in tqdm(declarations)])
        )
        df.to_parquet(self.filename)

    @staticmethod
    def parse_declaration(declaration: BeautifulSoup) -> list[dict]:
        """
        Flatten the XML of a single declaration into a list of all the items.
        """
        global_infos = DeclaInteretWorkflow._declaration_global_infos(declaration)
        itemized_sections = list(
            chain(
                *[
                    DeclaInteretWorkflow._parse_mandat_revenues(declaration),
                ]
            )
        )
        if itemized_sections:
            return [global_infos | x for x in itemized_sections]
        return [global_infos]

    @staticmethod
    def _declaration_global_infos(declaration: BeautifulSoup) -> dict:
        """
        Identify general information about the declaration or the elected official;
        """
        general = declaration.find("general")
        declarant = general.find("declarant")
        qualite_mandat = general.find("qualiteMandat")

        global_infos = {
            "date_depot": tag_datetime(declaration.find("dateDepot")),
            "declaration_id": declaration.find("uuid"),
            "complete": declaration.find("complete") == "true",
            "nothing_to_declare": declaration.find("neant") == "true",
            "type_declaration": general.find("typeDeclaration").find("id"),
            "mandat": ",".join(tag_text(x) for x in general.find("mandat").find_all("label")),
            "civilite": declarant.find("civilite"),
            "nom": declarant.find("nom"),
            "prenom": declarant.find("prenom"),
            "date_naissance": tag_datetime(declarant.find("dateNaissance")),
            "type_mandat": qualite_mandat.find("typeMandat"),
            "qualite_mandat": general.find("qualiteDeclarant"),
            "categorie_mandat": qualite_mandat.find("codCategorieMandat"),
            "mandat_organe_type": qualite_mandat.find("codeListeOrgane"),
            "mandat_organe_code": general.find("organe").find("codeOrgane"),
            "debut_mandat": tag_datetime(general.find("dateDebutMandat")),
            "fin_mandat": tag_datetime(general.find("dateFinMandat")),
            "regime_matrimonial": general.find("regimeMatrimonial"),
            "entreprise": general.find("nomSociete"),
            "entreprise_mere": general.find("nomSocieteMere"),
            "entreprise_ca": general.find("chiffreAffaire"),
            "nb_logements": general.find("nbLogements"),
            "to_parse": DeclaInteretWorkflow._non_parsed_sections(declaration),
        }
        return {
            k: (tag_text(v) if isinstance(v, bs4.element.Tag) else v)
            for k, v in global_infos.items()
        }

    @staticmethod
    def _non_parsed_sections(declaration: BeautifulSoup) -> str:
        """
        Identify sections with content but not yet implemented.
        """
        children = declaration.find_all(recursive=False)
        non_parsed = set([c.name for c in children]) - set(GENERAL_TAGS) - set(PARSED_SECTIONS)

        to_parse = []
        for name in non_parsed:
            tag = declaration.find(name)
            items = tag.find("items")
            if (not items or not len(items.contents)) and (
                tag_text(tag.find("neant")) == "true"
            ):
                continue
            to_parse.append(name)

        return ",".join(sorted(to_parse)) if to_parse else None

    @staticmethod
    def _parse_mandat_revenues(declaration: BeautifulSoup) -> list[dict]:
        """
        Parse the section regarding money received as elected official salary.
        """
        section = declaration.find("mandatElectifDto")
        if not section:
            return []
        uuid = tag_text(declaration.find("uuid"))

        items = section.find("items")
        is_neant = tag_bool(section.find("neant"))
        if not items and is_neant:
            return []

        if not items:
            logging.info(f"Error parsing mandat, no items and neant is fales : {uuid}")
            return []

        items = items.find("items")
        if not items and is_neant:
            return []

        if not items or not len(items.contents):
            logging.info(f"Wrongly parsed mandat : {uuid}")
            return []

        remuneration = items.find("remuneration")
        general_infos = {
            "description": tag_text(items.find("description")),
            "commentaire": tag_text(items.find("commentaire")),
            "remuneration_brut_net": tag_text(remuneration.find("brutNet")),
            "description_mandat": tag_text(section.find("descriptionMandat")),
        }
        montants = remuneration.find("montant", recursive=False)
        if not montants and any(v is not None for v in general_infos.values()):
            return [general_infos]

        if not montants:
            logging.info(f"Wrongly parsed mandat : {uuid}")
            return []
        return [
            general_infos
            | {
                "montant": tag_float(item.find("montant")),
                "date_remuneration": datetime(
                    year=tag_int(item.find("annee")) or 1970, month=12, day=31
                ),
            }
            for item in montants.find_all("montant", recursive=False)
        ]


def tag_datetime(tag: BeautifulSoup) -> datetime:
    if tag and tag.text:
        fmt = "%d/%m/%Y"
        if " " in tag.text:
            fmt += " %H:%M:%S"
        return datetime.strptime(tag.text, fmt)
    return None


def tag_text(tag: BeautifulSoup) -> str | None:
    if tag and tag.text and (tag.text != "[Données non publiées]"):
        return tag.text
    return None


def tag_bool(tag: BeautifulSoup) -> str | None:
    txt = tag_text(tag)
    return txt and (txt == "true")


def tag_float(tag: BeautifulSoup) -> float | None:
    if tag and tag.text:
        return float(
            tag.text.replace(" ", "")
            .replace("\u202f", "")
            .replace("\xa0", "")
            .replace(",", ".")
        )
    return None


def tag_int(tag: BeautifulSoup) -> int | None:
    f = tag_float(tag)
    if f is not None:
        return int(f)
    return None
