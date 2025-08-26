import json
from pathlib import Path

import numpy as np
import pandas as pd
import polars as pl
from inflection import underscore as to_snake_case
from unidecode import unidecode

from back.scripts.datasets.communes import CommunesWorkflow
from back.scripts.datasets.cpv_labels import CPVLabelsWorkflow
from back.scripts.datasets.marches import MarchesPublicsWorkflow
from back.scripts.datasets.nuts_departements import NutsDepartementsWorkflow
from back.scripts.datasets.sirene import SireneWorkflow
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.enrichment.utils.cpv_utils import CPVUtils
from back.scripts.utils.dataframe_operation import (
    IdentifierFormat,
    normalize_date,
    normalize_identifiant,
    normalize_montant,
)


class MarchesPublicsEnricher(BaseEnricher):
    @classmethod
    def get_dataset_name(cls) -> str:
        return "marches_publics"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> list[Path]:
        return [
            MarchesPublicsWorkflow.get_output_path(main_config),
            CPVLabelsWorkflow.get_output_path(main_config),
            SireneWorkflow.get_output_path(main_config),
            NutsDepartementsWorkflow.get_output_path(main_config),
            CommunesWorkflow.get_output_path(main_config),
        ]

    @classmethod
    def _clean_and_enrich(cls, inputs: list[pl.DataFrame]) -> pl.DataFrame:
        # Data analysts, please add your code here!
        marches, cpv_labels, sirene, nuts, communes, *_ = inputs

        # table de correspondance entre codes nuts et codes insee départements
        nuts = (
            nuts.filter(pl.col("NUTS level") == 3)
            .select(["NUTS Code", "code_departement_insee"])
            .with_columns(pl.col("NUTS Code").str.to_lowercase())
        )

        # table de correspondance entre le nom département, code département, code région, nom région
        departements = (
            communes.select(["Département", "Code Département", "Code Région", "Région"])
            .with_columns(pl.col("Département").str.to_lowercase().alias("Département_lower"))
            .with_columns(
                pl.col("Département_lower")
                .str.replace_all("-", " ")
                .alias("Département_sans_tiret")
            )
            .with_columns(
                pl.when(pl.col("Code Département") == "97")
                .then(
                    pl.concat_str(
                        [pl.col("Code Département"), pl.col("Code Région").str.slice(1, 2)]
                    )
                )
                .otherwise(pl.col("Code Département"))
            )
            .unique()
        )

        # table de correspondance entre le nom commune, code insee commune, code postal
        communes = (
            communes.select(["Commune", "Code INSEE", "Code Postal"])
            .with_columns(pl.col("Commune").str.to_lowercase().alias("Commune_lower"))
            .with_columns(
                pl.col("Commune_lower").str.replace_all("-", " ").alias("Commune_sans_tiret")
            )
        )

        marches_pd = (
            marches.to_pandas()
            .pipe(cls.set_unique_mp_id)
            .pipe(cls.set_unique_mp_titulaire_id)
            .drop(columns=["id", "uid", "uuid"])
            .pipe(cls.keep_last_modifications)
            .apply(cls.appliquer_modifications, axis=1)
            .pipe(cls.correction_types_colonnes_str, ["objet"])
            .pipe(cls.correction_types_colonnes_float, ["dureeMois", "offresRecues"])
            .drop(columns=["modifications"])
            .pipe(normalize_montant, "montant")
            .pipe(normalize_date, "datePublicationDonnees")
            .pipe(normalize_date, "dateNotification")
            .pipe(normalize_identifiant, "acheteur_id", IdentifierFormat.SIREN)
            .pipe(cls._add_metadata)
            .assign(montant=lambda df: df["montant"] / df["countTitulaires"].fillna(1))
        )

        return (
            pl.from_pandas(marches_pd)
            .pipe(cls.drop_source_duplicates)
            .pipe(cls.drop_sous_traitance_duplicates)
            .pipe(cls.generate_new_id)
            .pipe(cls.forme_prix_enrich)
            .pipe(cls.type_identifiant_titulaire_enrich)
            .pipe(
                cls.generic_json_column_enrich,
                "considerationsEnvironnementales",
                "considerationEnvironnementale",
            )
            .pipe(cls.generic_json_column_enrich, "modaliteExecution", "modaliteExecution")
            .pipe(cls.generic_json_column_enrich, "technique", "technique")
            .pipe(cls.generic_json_column_enrich, "typesPrix", "typePrix")
            .pipe(cls.type_prix_enrich)
            .pipe(cls.lieu_execution_enrich, nuts, communes, departements)
            .pipe(CPVUtils.add_cpv_labels, cpv_labels=cpv_labels)
            .rename(to_snake_case)
            .pipe(cls.drop_rows_with_null_dates_or_amounts)
            .pipe(cls.assoc_with_sirene, sirene)
        )

    @staticmethod
    def assoc_with_sirene(marches: pl.DataFrame, sirene: pl.DataFrame) -> pl.DataFrame:
        marches = (
            marches.with_columns(
                pl.col("titulaire_id")
                .cast(pl.Utf8)
                .str.slice(0, 9)
                .alias("titulaire_id_siren"),
            )
            .join(
                sirene.select("siren", "raison_sociale"),
                left_on="titulaire_id_siren",
                right_on="siren",
                how="left",
            )
            .with_columns(
                pl.col("titulaire_denomination_sociale").fill_null(pl.col("raison_sociale"))
            )
            .drop(["titulaire_id_siren", "raison_sociale"])
        )
        return marches

    @staticmethod
    def forme_prix_enrich(marches: pl.DataFrame) -> pl.DataFrame:
        return marches.with_columns(
            pl.when(pl.col("formePrix") == "Ferme, actualisable")
            .then(pl.lit("Ferme et actualisable"))
            .when(pl.col("formePrix") == "")
            .then(pl.lit(None))
            .otherwise(pl.col("formePrix"))
            .alias("forme_prix")
        ).drop("formePrix")

    @staticmethod
    def safe_typePrix_json_load(x):
        try:
            parsed = json.loads(x)
            if isinstance(parsed, list) and parsed:
                return parsed[0]
            elif isinstance(parsed, dict):
                type_prix = parsed.get("typePrix")
                if isinstance(type_prix, list) and type_prix:
                    return type_prix[0]
                if isinstance(type_prix, str):
                    return type_prix
            return None
        except (json.JSONDecodeError, TypeError):
            return

    @staticmethod
    def set_unique_mp_id(marches: pd.DataFrame) -> pd.DataFrame:
        """
        Les différents champs id, uid et uuid ne permettent pas d'avoir un id unique par MP car ce sont des champs saisis.

        Le but de cette fonction est de créer un id unique par MP, pour ensuite créer un id plus propre par MP.
        """
        marches["id_mp"] = (
            marches[["id", "uid", "uuid", "dateNotification", "codeCPV"]]
            .astype(str)
            .apply(lambda row: "-".join([val for val in row if val != "nan"]), axis=1)
        )
        return marches

    @staticmethod
    def set_unique_mp_titulaire_id(marches: pd.DataFrame) -> pd.DataFrame:
        """
        Les différents champs id, uid et uuid ne permettent pas d'avoir un id unique par MP car ce sont des champs saisis.

        Le but de cette fonction est de créer un id unique par MP et titulaire, pour ensuite dédoublonner par ce nouvel id.
        """
        marches["id_mp_titulaire"] = (
            marches[["id_mp", "titulaire_id"]]
            .astype(str)
            .apply(lambda row: "-".join([val for val in row if val != "nan"]), axis=1)
        )
        return marches

    @staticmethod
    def type_prix_enrich(marches: pl.DataFrame) -> pl.DataFrame:
        return (
            marches.with_columns(
                pl.coalesce(pl.col(["typesPrix", "typePrix", "TypePrix"])).alias("typePrix")
            )
            .with_columns(
                pl.when((pl.col("typePrix") == "") | (pl.col("typePrix") == "NC"))
                .then(pl.lit(None))
                .otherwise(pl.col("typePrix"))
            )
            .rename({"typePrix": "type_prix"})
            .drop(["typesPrix", "TypePrix"])
        )

    @staticmethod
    def type_identifiant_titulaire_enrich(marches: pl.DataFrame) -> pl.DataFrame:
        """
        1 - Normalize titulaire_typeIdentifiant column from titulaire_typeIdentifiant
        - "HORS_UE"                becomes  "HORS-UE",
        - "TVA_INTRACOMMUNAUTAIRE" becomes  "TVA",
        - "FRW"                    becomes  "FRWF",
        - "UE"                     becomes  "TVA",
        2 - Then we fill in titulaire_typeIdentifiant from titulaire_id if titulaire_id is like a SIRET, SIREN or TVA.
        """

        # TODO : Il y a encore environ 600 titulaire_typeIdentifiant avec des titulaire_id non null qui sont null
        SIRET_REGEX = r"^\d{14}$"  # 14 chiffres uniquement
        SIREN_REGEX = r"^\d{9}$"  # 9 chiffres uniquement
        TVA_REGEX = r"^[A-Z]{2}\d{9,12}$"  # Ex: GB123456789 ou FR12345678912

        mapping = {
            "HORS_UE": "HORS-UE",
            "TVA_INTRACOMMUNAUTAIRE": "TVA",
            "FRW": "FRWF",
            "UE": "TVA",
        }

        return (
            marches.with_columns(
                pl.when(pl.col("titulaire_typeIdentifiant").is_not_null()).then(
                    pl.col("titulaire_typeIdentifiant")
                    .replace_strict(mapping, default=pl.col("titulaire_typeIdentifiant"))
                    .alias("titulaire_typeIdentifiant")
                )
            )
            .with_columns(
                pl.when(
                    pl.col("titulaire_typeIdentifiant").is_null()
                    & pl.col("titulaire_id").is_not_null()
                    & pl.col("titulaire_id").cast(pl.Utf8).str.contains(SIRET_REGEX)
                )
                .then(pl.lit("SIRET"))
                .otherwise(pl.col("titulaire_typeIdentifiant"))
                .alias("titulaire_typeIdentifiant")
            )
            .with_columns(
                pl.when(
                    pl.col("titulaire_typeIdentifiant").is_null()
                    & pl.col("titulaire_id").is_not_null()
                    & pl.col("titulaire_id").cast(pl.Utf8).str.contains(SIREN_REGEX)
                )
                .then(pl.lit("SIREN"))
                .otherwise(pl.col("titulaire_typeIdentifiant"))
                .alias("titulaire_typeIdentifiant")
            )
            .with_columns(
                pl.when(
                    pl.col("titulaire_typeIdentifiant").is_null()
                    & pl.col("titulaire_id").is_not_null()
                    & pl.col("titulaire_id").cast(pl.Utf8).str.contains(TVA_REGEX)
                )
                .then(pl.lit("TVA"))
                .otherwise(pl.col("titulaire_typeIdentifiant"))
                .alias("titulaire_type_identifiant")
            )
            .drop("titulaire_typeIdentifiant")
        )

    @staticmethod
    def safe_json_load(x):
        """Parse le JSON et retourne {} en cas d'erreur."""
        try:
            if isinstance(x, dict):
                return x
            if x and isinstance(x, str) and x.strip() != "":
                return json.loads(x)
        except json.JSONDecodeError:
            return {}
        return {}

    @staticmethod
    def join_nuts_and_coalesce(df: pl.DataFrame, col: str, nuts: pl.DataFrame) -> pl.DataFrame:
        """
        Les colonnes lieu_execution_code_truc peuvent contenir des codes nuts qui sont comme des codes de départements mais à la maille de l'Europe
        Ces codes nuts sont convertis en code départementaux "Français" pour plus de lisibilité
        """
        return (
            df.join(nuts, left_on=col, right_on="NUTS Code", how="left")
            .with_columns(
                pl.coalesce([pl.col("code_departement_insee"), pl.col(col)]).alias(col)
            )
            .drop("code_departement_insee")
        )

    @staticmethod
    def join_departements_and_coalesce(
        df: pl.DataFrame,
        left_col: str,
        right_col: str,
        departements: pl.DataFrame,
        pattern_code_departement: str,
    ) -> pl.DataFrame:
        """
        Les colonnes lieu_execution_code_truc peuvent contenir des départements écris en toute lettre
        On les convertit en code département grâce à un fichier insee
        """

        return (
            df.join(
                departements.select(pl.col(right_col), pl.col("Code Département")),
                left_on=left_col,
                right_on=right_col,
                how="left",
            )
            .with_columns(
                pl.when(
                    pl.col("lieu_execution_code_departement").is_null()
                    | ~pl.col("lieu_execution_code_departement").str.contains(
                        pattern_code_departement, literal=False
                    )
                )
                .then(
                    pl.coalesce(
                        [pl.col("Code Département"), pl.col("lieu_execution_code_departement")]
                    )
                )
                .otherwise(pl.col("lieu_execution_code_departement"))
                .alias("lieu_execution_code_departement")
            )
            .drop(["Code Département"])
        )

    @classmethod
    def clean_column_by_regex(cls, marches: pl.DataFrame, c: str, regex: str) -> pl.DataFrame:
        """
        Nettoyage des colonnes selon un regex
        """
        return marches.with_columns(
            pl.when(pl.col(c).str.contains(regex, literal=False))
            .then(pl.col(c).str.extract(regex, group_index=1))
            .otherwise(pl.col(c))
            .alias(c)
        )

    @classmethod
    def lieu_execution_code_clean(
        cls,
        marches: pl.DataFrame,
        nuts: pl.DataFrame,
        communes: pl.DataFrame,
        departements: pl.DataFrame,
        lieu_execution_cols: list,
        pattern_code_departement: str,
        pattern_code_postal: str,
        pattern_code_commune: str,
    ) -> pl.DataFrame:
        """
        Nettoie les colonnes lieu_execution_code_postal, lieu_execution_code_commune et lieu_execution_code_departement, lieu_execution_code_arrondissement
        1- En convertissant les codes nuts (code européen des départements) en code département insee
        2- En comblant les trous de code commune à partir du code arrondissement
        3- En comblant les trous de code département à partir des code postal ou code commune ou code arrondissement
        3- En effaçant tous les codes qui ne correpondent pas au pattern attendu pour ces colonnes
        """

        regex_for_codes = [
            r"^fr\s*(\d{5})$",
            r"^f\s*(\d{5})r$",
            r"(\d{5})/",
            r"^dpt\s*(\d{3})$",
            r"^dep\s*(\d{3})$",
            r"^dpt\s*(\d{2})$",
            r"^dep\s*(\d{2})$",
        ]

        for c in lieu_execution_cols:
            # Nettoyage quand on a des codes nuts dans les colonnes des codes postal, commune ou departement
            marches = MarchesPublicsEnricher.join_nuts_and_coalesce(marches, c, nuts)

            # Nettoyage quand on a des noms de départements à la place des codes postal, commune ou departement
            marches = MarchesPublicsEnricher.join_departements_and_coalesce(
                marches, c, "Département_lower", departements, pattern_code_departement
            )
            marches = MarchesPublicsEnricher.join_departements_and_coalesce(
                marches, c, "Département_sans_tiret", departements, pattern_code_departement
            )

            # Nettoyage des codes "fr 12345" ou "fr12345" ou "f12345r" ou "dep01" ou "dpt01" ou "12345/23456"
            for regex in regex_for_codes:
                marches = MarchesPublicsEnricher.clean_column_by_regex(marches, c, regex)

        # Si on a des valeurs abhérrantes dans lieu_execution_code_commune , on complète avec lieu_execution_code_arrondissement
        # Si on a des valeurs abhérrantes dans lieu_execution_code_departement , on complète avec lieu_execution_code_ + arrondissement|commune|postal
        # On nettoie les valeurs de lieu_execution_code_departement
        # On nettoie les valeurs lieu_execution_code_ + postal|commune

        return (
            marches.with_columns(
                pl.when(
                    pl.col("lieu_execution_code_departement").is_null()
                    | (
                        ~pl.col("lieu_execution_code_departement").str.contains(
                            pattern_code_departement, literal=False
                        )
                        & ~pl.col("lieu_execution_code_departement").str.contains(
                            pattern_code_commune, literal=False
                        )
                    )
                )
                .then(
                    pl.coalesce(
                        "lieu_execution_code_postal",
                        "lieu_execution_code_commune",
                        "lieu_execution_code_arrondissement",
                    )
                )
                .otherwise(pl.col("lieu_execution_code_departement"))
                .alias("lieu_execution_code_departement")
            )
            .with_columns(
                pl.when(
                    (
                        pl.col("lieu_execution_code_commune").is_null()
                        | ~pl.col("lieu_execution_code_commune").str.contains(
                            pattern_code_commune, literal=False
                        )
                    )
                )
                .then(pl.col("lieu_execution_code_arrondissement"))
                .otherwise(pl.col("lieu_execution_code_commune"))
                .alias("lieu_execution_code_commune")
            )
            .with_columns(
                pl.when(
                    pl.col("lieu_execution_code_departement").is_not_null()
                    & pl.col("lieu_execution_code_departement").str.contains(
                        pattern_code_departement, literal=False
                    )
                )
                .then(pl.col("lieu_execution_code_departement"))
                .otherwise(
                    pl.when(
                        pl.col("lieu_execution_code_departement").is_not_null()
                        & pl.col("lieu_execution_code_departement").str.contains(
                            pattern_code_commune, literal=False
                        )
                    )
                    .then(
                        pl.when(
                            pl.col("lieu_execution_code_departement").str.slice(0, 2) == "97"
                        )
                        .then(pl.col("lieu_execution_code_departement").str.slice(0, 3))
                        .otherwise(pl.col("lieu_execution_code_departement").str.slice(0, 2))
                    )
                    .otherwise(None)
                )
                .alias("lieu_execution_code_departement")
            )
            .with_columns(
                pl.when(
                    pl.col("lieu_execution_code_commune").is_not_null()
                    & pl.col("lieu_execution_code_commune").str.contains(
                        pattern_code_commune, literal=False
                    )
                )
                .then(pl.col("lieu_execution_code_commune"))
                .otherwise(None)
                .alias("lieu_execution_code_commune")
            )
            .with_columns(
                pl.when(
                    pl.col("lieu_execution_code_postal").is_not_null()
                    & pl.col("lieu_execution_code_postal").str.contains(
                        pattern_code_postal, literal=False
                    )
                )
                .then(pl.col("lieu_execution_code_postal"))
                .otherwise(None)
                .alias("lieu_execution_code_postal")
            )
        )

    @classmethod
    def lieu_execution_parse(cls, marches: pl.DataFrame) -> pl.DataFrame:
        """
        Parsing de la colonne lieuExecution en 3 colonnes :
        - code (01 ou 01234 ou autres)
        - type code (commune, département, région, ...)
        - nom
        """
        # Cas spécifiques où lieu_execution_type_code = bourgogne ou franche-comte, au lieu de code departement
        mapping = {
            "bourgogne": "code departement",
            "franche-comte": "code departement",
        }

        return (
            marches.with_columns(
                pl.col("lieuExecution")
                .map_elements(
                    MarchesPublicsEnricher.safe_json_load,
                    return_dtype=pl.Object,
                )
                .alias("lieu_execution_parsed")
            )
            .with_columns(
                pl.col("lieu_execution_parsed")
                .map_elements(
                    lambda d: str(d.get("code")) if d.get("code") is not None else None,
                    return_dtype=pl.Utf8,
                )
                .str.to_lowercase()
                .alias("lieu_execution_code"),
                pl.col("lieu_execution_parsed")
                .map_elements(
                    lambda d: str(d.get("typeCode")) if d.get("typeCode") is not None else None,
                    return_dtype=pl.Utf8,
                )
                .str.to_lowercase()
                .alias("lieu_execution_type_code"),
                pl.col("lieu_execution_parsed")
                .map_elements(
                    lambda d: str(d.get("nom")) if d.get("nom") is not None else None,
                    return_dtype=pl.Utf8,
                )
                .str.to_lowercase()
                .alias("lieu_execution_nom"),
            )
            .with_columns(
                pl.col("lieu_execution_type_code")
                .map_elements(lambda x: unidecode(x), return_dtype=pl.Utf8)
                .alias("lieu_execution_type_code")
            )
            .with_columns(
                pl.when(pl.col("lieu_execution_type_code").is_not_null()).then(
                    pl.col("lieu_execution_type_code")
                    .replace_strict(mapping, default=pl.col("lieu_execution_type_code"))
                    .alias("lieu_execution_type_code")
                )
            )
            .drop("lieu_execution_parsed")
        )

    @classmethod
    def lieu_execution_categorize_types(
        cls, marches: pl.DataFrame, lieu_execution_cols: list
    ) -> pl.DataFrame:
        """
        A partir de la colonne lieu_execution_type_code, on créé plusieurs colonnes lieu_execution_code_...
        Et on ne garde pour le moment que lieu_execution_code_departement, lieu_execution_code_arrondissement, lieu_execution_code_postal, lieu_execution_code_commune
        """

        types = marches["lieu_execution_type_code"].drop_nulls().unique().to_list()

        return (
            marches.with_columns(
                [
                    pl.when(pl.col("lieu_execution_type_code") == type_code)
                    .then(pl.col("lieu_execution_code"))
                    .otherwise(None)
                    .alias("lieu_execution_" + type_code.replace(" ", "_"))
                    for type_code in types
                ]
            )
            .with_columns(
                [
                    pl.col(col)
                    .map_elements(lambda x: unidecode(x), return_dtype=pl.Utf8)
                    .alias(col)
                    for col in lieu_execution_cols
                ]
            )
            .drop(
                [
                    "lieu_execution_type_code",
                    "lieu_execution_code",
                    "lieuExecution",
                    "lieu_execution_code_pays",
                    "lieu_execution_code_canton",
                    "lieu_execution_code_region",
                ]
            )
        )

    @classmethod
    def lieu_execution_complete_code_postal_from_code_commune(
        cls, marches: pl.DataFrame, communes: pl.DataFrame, pattern_code_postal: str
    ) -> pl.DataFrame:
        """
        Complétion de la colonne lieu_execution_code_postal à partir d'un fichier qui contient le lien entre code commune et code postal, et à partir de la colonne lieu_execution_code_commune
        """
        return (
            marches.join(
                communes.select("Code INSEE", "Code Postal"),
                left_on="lieu_execution_code_commune",
                right_on="Code INSEE",
                how="left",
            )
            .with_columns(
                pl.when(
                    pl.col("lieu_execution_code_postal").is_null()
                    | ~pl.col("lieu_execution_code_postal").str.contains(
                        pattern_code_postal, literal=False
                    )
                )
                .then(
                    pl.coalesce([pl.col("Code Postal"), pl.col("lieu_execution_code_postal")])
                )
                .otherwise(pl.col("lieu_execution_code_postal"))
                .alias("lieu_execution_code_postal")
            )
            .drop(["Code Postal"])
        )

    @classmethod
    def lieu_execution_add_labels(
        cls, marches: pl.DataFrame, communes: pl.DataFrame, departements: pl.DataFrame
    ) -> pl.DataFrame:
        """
        Ajout des noms de communes, départements, régions et codes de régions :
        - lieu_execution_label_commune
        - lieu_execution_label_departement
        - lieu_execution_code_region
        - lieu_execution_label_region
        à partir de lieu_execution_code_commune et lieu_execution_code_departement
        """
        return (
            marches.join(
                communes.select("Code INSEE", "Commune"),
                left_on="lieu_execution_code_commune",
                right_on="Code INSEE",
                how="left",
            )
            .join(
                departements.select("Département", "Code Département", "Code Région", "Région"),
                left_on="lieu_execution_code_departement",
                right_on="Code Département",
                how="left",
            )
            .rename(
                {
                    "Commune": "lieu_execution_label_commune",
                    "Département": "lieu_execution_label_departement",
                    "Code Région": "lieu_execution_code_region",
                    "Région": "lieu_execution_label_region",
                }
            )
        )

    @classmethod
    def lieu_execution_enrich(
        cls,
        marches: pl.DataFrame,
        nuts: pl.DataFrame,
        communes: pl.DataFrame,
        departements: pl.DataFrame,
    ) -> pl.DataFrame:
        """
        Fonction qui va traiter la colonne lieuExecution qui peut apporter des informations géographiques
        1 - parser la colonne lieuExecution en 3 champs code, type code et nom
        2 - extraire le tout en code commune, code postal, code departement, code arrondissement etc
        3 - complétion de code département par les autres colonnes si possible
        4 - nettoyage des codes par regex
        5 - complétion du code postal à partir de code commune et nettoyage du code postal
        6 - Ajout des noms de commune, departement et region

        TODO Pistes d'améliorations pour les lieux d'execution:
        - on a des département en chiffre dans les lieu_execution_nom pour encore compléter le code départements
        - dans le fichier commune/postal, il y a plusieurs code postaux pour 1 commune ..
        - Il y a des codes communes qui n'existent pas dans le fichier des communes, par exemple 69123 pour Lyon, probablement car plusieurs codes postaux pour toute la commune de lyon
        - on peut avoir plusieurs code départements ou code postal ou code commune pour 1 seul MP, pour l'instant on n'en retient qu'un seul.
        """

        lieu_execution_cols = [
            "lieu_execution_code_departement",
            "lieu_execution_code_arrondissement",
            "lieu_execution_code_postal",
            "lieu_execution_code_commune",
        ]

        pattern_code_departement = (
            r"^(?:\d{2}|971|972|973|974|975|976|977|978|984|986|987|988|989|2A|2B)$"
        )
        pattern_code_postal = r"^\d{5}$"
        pattern_code_commune = r"^(?:\d{2}|\d{3}|2A|2B)\d{3}$"

        return (
            marches.pipe(cls.lieu_execution_parse)
            .pipe(cls.lieu_execution_categorize_types, lieu_execution_cols)
            .pipe(
                cls.lieu_execution_code_clean,
                nuts,
                communes,
                departements,
                lieu_execution_cols,
                pattern_code_departement,
                pattern_code_postal,
                pattern_code_commune,
            )
            .pipe(
                cls.lieu_execution_complete_code_postal_from_code_commune,
                communes,
                pattern_code_postal,
            )
            .pipe(cls.clean_column_by_regex, "lieu_execution_code_postal", r"(\d{5})/")
            .pipe(cls.lieu_execution_add_labels, communes, departements)
        )

    @classmethod
    def _add_metadata(cls, df: pd.DataFrame) -> pd.DataFrame:
        return df.assign(
            anneeNotification=df["dateNotification"].dt.year.astype("Int64"),
            anneePublicationDonnees=df["datePublicationDonnees"].dt.year.astype("Int64"),
            obligation_publication=pd.cut(
                df["montant"],
                bins=[0, 40000, float("inf")],
                labels=["Optionnel", "Obligatoire"],
                right=False,
            ),
            delaiPublicationJours=(
                df["datePublicationDonnees"] - df["dateNotification"]
            ).dt.days,
        )

    @classmethod
    def concat_list(cls, lst: str):
        if len(lst) > 0:
            return " et ".join(sorted(set(lst)))
        return None

    @classmethod
    def safe_json_load_of_dict_or_list_or_str(cls, col_value: str, dict_key: str):
        try:
            parsed = json.loads(col_value)
            if isinstance(parsed, list) and parsed:
                return MarchesPublicsEnricher.concat_list(parsed)
            elif isinstance(parsed, dict):
                dct = parsed.get(dict_key)
                if isinstance(dct, list) and dct:
                    return MarchesPublicsEnricher.concat_list(dct)
                if isinstance(dct, str):
                    return dct
            return None
        except (json.JSONDecodeError, TypeError):
            if isinstance(col_value, str) and (col_value != ""):
                return col_value
            return None

    @classmethod
    def generic_json_column_enrich(
        cls, marches: pl.DataFrame, col_name: str, dict_key: str
    ) -> pl.DataFrame:
        return marches.with_columns(
            pl.col(col_name)
            .map_elements(
                lambda x: MarchesPublicsEnricher.safe_json_load_of_dict_or_list_or_str(
                    x, dict_key
                ),
                return_dtype=pl.Utf8,
            )
            .alias(col_name)
        )

    @staticmethod
    def drop_source_duplicates(marches: pl.DataFrame) -> pl.DataFrame:
        """
        Certains MP identiques viennent de sources différentes
        On enlève un des doublons
        """

        # Dataset of sources by frequency to build priority when deduplicating
        source_priority = (
            marches["source"]
            .value_counts(sort=True)
            .with_row_index(name="priority")
            .drop("count")
        )

        return (
            marches.join(source_priority, on="source", how="left")
            .with_columns(
                pl.col("priority")
                .fill_null(999)
                .rank("dense", descending=False)
                .over("id_mp_titulaire")
                .alias("rank")
            )
            .with_columns((pl.col("rank") > 1).cast(pl.Int8).alias("is_duplicate"))
            .filter(pl.col("is_duplicate") == 0)
            .drop(["is_duplicate", "rank", "priority"])
        )

    @staticmethod
    def drop_sous_traitance_duplicates(marches: pl.DataFrame) -> pl.DataFrame:
        """
        Certains MP sont en doublons mais avec la colonne actesSousTraitance différente.
        Cette fonction sert à dédoublonner ces cas.
        On va notamment garder la ligne avec le plus d'actes de sous traitance
        """

        return marches.sort(["titulaire_id", "objet", "actesSousTraitance"]).unique(
            subset=["id_mp_titulaire", "titulaire_id", "objet"], keep="first"
        )

    @staticmethod
    def tri_modification(mod):
        # Tri personnalisé sans convertir les id entiers en chaînes
        return (
            mod.get("datePublicationDonneesModification")
            or mod.get("dateNotificationModification")
            or mod.get("dateSignatureModification")
            or mod.get("updated_at")
            or (mod.get("id") if isinstance(mod.get("id"), str) else "")
        )

    @staticmethod
    def appliquer_modifications(row):
        try:
            modifications_raw = row["modifications"]
            modifications_list = json.loads(modifications_raw)
        except (json.JSONDecodeError, TypeError):
            return row  # on ignore si la valeur est vide ou mal formée

        # Si ce n'est pas une liste (ex: un dict direct ou None), on ignore
        if not isinstance(modifications_list, list):
            # modifications_invalides += 1  # 61 lignes invalides !!!  donc potentiellement non traitées mais je ne sais pas vraiment ce qui bloque
            return row

        # Extraire proprement les dicts de modification (cas [{"modification": {...}}, ...])
        #  En l'adaptant, potentiellement réutilisable pour l'extraction des listes de dicts des titulaires
        modifs = [
            mod["modification"] if isinstance(mod, dict) and "modification" in mod else mod
            for mod in modifications_list
        ]

        modifs_sorted = sorted(modifs, key=MarchesPublicsEnricher.tri_modification)

        for modif in modifs_sorted:
            for key, value in modif.items():
                # Gestion spéciale de 'id'
                if key == "id":
                    if isinstance(value, int):
                        continue  # On ignore les id techniques
                    elif isinstance(value, str):
                        row["id"] = value  # Appliquer le vrai identifiant
                        continue

                # Normalisation du nom de la clé
                base_key = (
                    key.replace("Modification", "") if key.endswith("Modification") else key
                )

                if base_key in row:
                    try:
                        if isinstance(row[base_key], (float, int)):
                            row[base_key] = float(value)
                        else:
                            row[base_key] = value
                    except (ValueError, TypeError):
                        row[base_key] = value

        return row

    @staticmethod
    def correction_types_colonnes_str(
        marches: pd.DataFrame, colonnes_a_convertir_en_str: list
    ) -> pd.DataFrame:
        # Corrige les types des colonnes avant la conversion en polars
        marches[colonnes_a_convertir_en_str] = (
            marches[colonnes_a_convertir_en_str].astype(str).replace("nan", "")
        )
        return marches

    @staticmethod
    def correction_types_colonnes_float(
        marches: pd.DataFrame, colonnes_a_convertir_en_float: list | str
    ) -> pd.DataFrame:
        # Remplace les NC présents dans les données de type float par des données vides.
        if False and isinstance(colonnes_a_convertir_en_float, list):
            for _correction_types_colonnes_float in correction_types_colonnes_float:
                marches = correction_types_colonnes_float(
                    marches, _correction_types_colonnes_float
                )
        else:
            marches[colonnes_a_convertir_en_float] = marches[
                colonnes_a_convertir_en_float
            ].replace("NC", np.nan)
        return marches

    @staticmethod
    def keep_last_modifications(marches: pd.DataFrame) -> pd.DataFrame:
        """
        A chaque modification d'un MP, une nouvelle ligne avec les infos initiales du MP est ajoutée au dataset et le champs "modifications" est incrémenté avec les nouvelles modifications.
        Cela produit autant de doublons que d'étapes de modifications du MP dans le dataset
        Cette fonction ne conserve un MP qu'avec sa dernière version de modifications
        En théorie, c'est pour chaque MP, la ligne avec le champs "modifications" le plus rempli.
        """

        return (
            marches.assign(modifications_length=marches["modifications"].fillna("").str.len())
            .sort_values(["id_mp_titulaire", "modifications_length"], ascending=False)
            .drop_duplicates("id_mp_titulaire")
            .drop(columns="modifications_length")
        )

    @staticmethod
    def generate_new_id(marches: pl.DataFrame) -> pl.DataFrame:
        # Génère un nouvel id unique, entier, pour chaque MP

        id_mapping = (
            marches.select("id_mp")
            .unique()
            .with_row_count(name="id")  # génère l'entier par valeur unique
        )

        return marches.join(id_mapping, on="id_mp", how="left").drop(
            ["id_mp", "id_mp_titulaire"]
        )

    @staticmethod
    def drop_rows_with_null_dates_or_amounts(marches: pl.DataFrame) -> pl.DataFrame:
        """
        Supprime les lignes où 'date_publication_donnees' ou 'montant' sont nulles.
        """
        return marches.filter(
            pl.col("date_publication_donnees").is_not_null() & pl.col("montant").is_not_null()
        )
