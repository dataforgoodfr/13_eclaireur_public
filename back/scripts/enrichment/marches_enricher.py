import ast
import json
from pathlib import Path

import numpy as np
import pandas as pd
import polars as pl
from inflection import underscore as to_snake_case
from sqlalchemy.sql import true
from unidecode import unidecode

from back.scripts.datasets.cpv_labels import CPVLabelsWorkflow
from back.scripts.datasets.marches import MarchesPublicsWorkflow
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
        ]

    @classmethod
    def _clean_and_enrich(cls, inputs: list[pl.DataFrame]) -> pl.DataFrame:
        # Data analysts, please add your code here!
        marches, cpv_labels, sirene, *_ = inputs

        marches_pd = (
            marches.pipe(cls.set_unique_mp_id_hash)
            .pipe(cls.keep_last_modifications_par_mp)
            .to_pandas()
            .apply(cls.appliquer_modifications, axis=1)
            .drop(columns=["modifications"])
            .pipe(cls.unnest_titulaires)
            .pipe(
                cls.correction_types_colonnes_str,
                [
                    "objet",
                    "titulaire_typeIdentifiant",
                    "titulaire_id",
                    "titulaire_denominationSociale",
                    "titulaire_contact.id",
                    "titulaire_contact.nom",
                    "titulaire_contact.prenom",
                    "titulaire_contact.email",
                    "codeCPV",
                ],
            )
            .pipe(cls.correction_types_colonnes_float, ["dureeMois", "offresRecues"])
            .pipe(normalize_montant, "montant")
            .pipe(normalize_date, "datePublicationDonnees")
            .pipe(normalize_date, "dateNotification")
            .pipe(normalize_identifiant, "acheteur_id", IdentifierFormat.SIREN)
            .pipe(cls._add_metadata)
            .rename(columns={"montant": "montant_du_marche_public"})
            .assign(
                montant_du_marche_public_par_titulaire=lambda df: df["montant_du_marche_public"]
                / df["countTitulaires"].fillna(1)
            )
        )

        return (
            pl.from_pandas(marches_pd)
            .pipe(cls.generate_id_mp_index)
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
            .pipe(cls.lieu_execution_enrich)
            .pipe(CPVUtils.add_cpv_labels, cpv_labels=cpv_labels)
            .rename(to_snake_case)
            .pipe(cls.drop_rows_with_null_dates_or_amounts)
            .pipe(cls.handle_outlier_amounts)
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
    def set_unique_mp_id_hash(marches: pd.DataFrame) -> pd.DataFrame:
        """
        Les différents champs id, uid et uuid ne permettent pas d'avoir un id unique par MP.
        Le but de cette fonction est de créer un id unique par MP.
        """

        return marches.with_columns(
            pl.concat_str(
                [
                    pl.col("id").cast(str).fill_null("None"),
                    pl.col("uid").cast(str).fill_null("None"),
                    pl.col("uuid").cast(str).fill_null("None"),
                    pl.col("acheteur_id").cast(str).fill_null("None"),
                    pl.col("titulaires").cast(str).fill_null("None"),
                    pl.col("montant").cast(str).fill_null("None"),
                    pl.col("objet").cast(str).fill_null("None"),
                    pl.col("dateNotification").cast(str).fill_null("None"),
                    pl.col("idAccordCadre").cast(str).fill_null("None"),
                    pl.col("codeCPV").cast(str).fill_null("None"),
                ]
            )
            .hash()
            .alias("id_mp")
        )

    @staticmethod
    def ensure_list_of_dicts(x):
        """
        Transforme x en une liste plate de dictionnaires.
        - None/NaN -> []
        - {"typeIdentifiant": "a", "denominationSociale": "b", "id": "c"} -> [{"typeIdentifiant": "a", "denominationSociale": "b", "id": "c"}]
        - [{"typeIdentifiant": "a", "denominationSociale": "b", "id": "c"}] -> [{"typeIdentifiant": "a", "denominationSociale": "b", "id": "c"}]
        - [[{"typeIdentifiant": "a", "denominationSociale": "b", "id": "c"}]] -> [{"typeIdentifiant": "a", "denominationSociale": "b", "id": "c"}]
        - {"titulaire": [{"typeIdentifiant": "a", "denominationSociale": "b", "id": "c"}]} -> [{"typeIdentifiant": "a", "denominationSociale": "b", "id": "c"}]
        - str JSON-like -> converti en [{"typeIdentifiant": "a", "denominationSociale": "b", "id": "c"}] si possible
        """
        if x is None or (isinstance(x, float) and pd.isna(x)):
            return []  # vide si NaN/None
        if isinstance(x, dict):
            if "titulaire" in x.keys():
                return MarchesPublicsEnricher.ensure_list_of_dicts(x["titulaire"])
            else:
                return [x]  # wrap dans une liste
        if isinstance(x, list):
            if (len(x) > 0) and (isinstance(x[0], list)):
                return MarchesPublicsEnricher.ensure_list_of_dicts(x[0])  # déjà une liste
            else:
                return x
        if isinstance(x, str):  # si string JSON-like ou repr de dict
            try:
                val = ast.literal_eval(x)
                return MarchesPublicsEnricher.ensure_list_of_dicts(val)
            except Exception:
                return []
        return []

    @staticmethod
    def unnest_titulaires(marches: pd.DataFrame) -> pd.DataFrame:
        """
        A partir de la liste des titulaires par MP, créé une ligne par titulaire par MP
        """

        # On s'assure que la colonne contient bien des listes de json
        marches["titulaires"] = marches["titulaires"].apply(
            MarchesPublicsEnricher.ensure_list_of_dicts
        )

        # 1. Dupliquer la ligne pour chaque dict de titulaire
        marches_exploded = marches.explode("titulaires", ignore_index=True)

        # 2. Normaliser les dictionnaires en colonnes
        titulaires_norm = pd.json_normalize(marches_exploded["titulaires"])

        # 3. Préfixer les colonnes
        titulaires_norm = titulaires_norm.add_prefix("titulaire_")

        # 4. Fusionner avec le DataFrame original (sans la colonne dict)
        marches_out = pd.concat([marches_exploded, titulaires_norm], axis=1)

        return marches_out.drop(columns=["titulaires"])

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
    def lieu_execution_enrich(marches: pl.DataFrame) -> pl.DataFrame:
        """Parse lieuExecution into code, typeCode and nom columns.

        Handles both DECP v1.5.0 (has ``nom``) and v2.0.3 (no ``nom`` --
        reconstructed during parsing from ``typeCode + code``).
        """

        type_code_mapping = {
            "bourgogne": "code departement",
            "franche-comte": "code departement",
        }

        df = (
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
                    .replace_strict(type_code_mapping, default=pl.col("lieu_execution_type_code"))
                    .alias("lieu_execution_type_code")
                )
            )
            .drop("lieu_execution_parsed")
        )

        # For v2 rows where nom was synthesised from "typeCode code", try to
        # provide a more meaningful value: use the code directly as nom when
        # the current value is just a typeCode prefix + code.
        if "_schema_version" in df.columns:
            df = df.with_columns(
                pl.when(
                    (pl.col("_schema_version") == "v2")
                    & pl.col("lieu_execution_nom").is_null()
                    & pl.col("lieu_execution_code").is_not_null()
                )
                .then(pl.col("lieu_execution_code"))
                .otherwise(pl.col("lieu_execution_nom"))
                .alias("lieu_execution_nom")
            )

        types = df["lieu_execution_type_code"].drop_nulls().unique().to_list()

        result = df.with_columns(
            [
                pl.when(pl.col("lieu_execution_type_code") == type_code)
                .then(pl.col("lieu_execution_code"))
                .otherwise(None)
                .alias("lieu_execution_" + type_code.replace(" ", "_"))
                for type_code in types
            ]
        )

        if "lieu_execution_code_departement" in result.columns:
            result = result.with_columns(
                pl.when(
                    pl.col("lieu_execution_code_departement").is_null()
                    & (
                        (
                            pl.col("lieu_execution_code_postal").is_not_null()
                            if "lieu_execution_code_postal" in result.columns
                            else pl.lit(False)
                        )
                        | (
                            pl.col("lieu_execution_code_commune").is_not_null()
                            if "lieu_execution_code_commune" in result.columns
                            else pl.lit(False)
                        )
                    )
                )
                .then(
                    pl.coalesce(
                        [c for c in ["lieu_execution_code_postal", "lieu_execution_code_commune"]
                         if c in result.columns]
                    ).str.slice(0, 2)
                )
                .otherwise(pl.col("lieu_execution_code_departement"))
                .alias("lieu_execution_code_departement")
            )

        cols_to_drop = [
            c for c in ["lieu_execution_type_code", "lieu_execution_code", "lieuExecution"]
            if c in result.columns
        ]
        return result.drop(cols_to_drop)

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

                # Gestion spéciale de 'titulaires' qui parfois ne contient pas de bonnes données
                if (key == "titulaires") & isinstance(value, list):
                    # Flatten une éventuelle liste de liste
                    flat = []
                    for v in value:
                        if isinstance(v, list):
                            flat.extend(v)
                        else:
                            flat.append(v)

                    # Cas 1 : exemple : "titulaires": []
                    if len(value) == 0:
                        continue

                    # Cas 2 : exemple : "titulaires": [[{"typeIdentifiant": null, "denominationSociale": null, "id": null}]]
                    # Si tous les dicts sont vides ou ne contiennent que des valeurs None ou null
                    all_empty = all(
                        isinstance(d, dict) and all(val is None for val in d.values())
                        for d in flat
                    )
                    if all_empty:
                        continue

                    # Cas 3 : exemple : "titulaires": [{"titulaire": "typeIdentifiant"}, {"titulaire": "id"}]
                    all_only_titulaire = all(
                        isinstance(d, dict) and "id" not in set(d.keys()) for d in flat
                    )
                    if all_only_titulaire:
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
        colonnes_existantes = [
            col for col in colonnes_a_convertir_en_str if col in marches.columns
        ]

        # Corrige les types des colonnes avant la conversion en polars
        marches[colonnes_existantes] = (
            marches[colonnes_existantes].astype(str).replace("nan", "")
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
    def keep_last_modifications_par_mp(marches: pl.DataFrame) -> pl.DataFrame:
        """
        A chaque modification d'un MP, une nouvelle ligne avec les infos initiales du MP est ajoutée au dataset et le champs "modifications" est incrémenté avec les nouvelles modifications.
        Cela produit autant de doublons que d'étapes de modifications du MP dans le dataset
        Cette fonction ne conserve un MP qu'avec sa dernière version de modifications
        En théorie, c'est pour chaque MP, la ligne avec le champs "modifications" le plus rempli.
        """

        return (
            marches.with_columns(
                pl.col("modifications")
                .fill_null("")
                .str.len_chars()
                .alias("modifications_length")
            )
            .sort(["id_mp", "modifications_length"], descending=[True, True])
            .unique(subset=["id_mp"], keep="first")
            .drop("modifications_length")
        )

    @staticmethod
    def generate_id_mp_index(marches: pl.DataFrame) -> pl.DataFrame:
        """
        Génère un nouvel id unique, entier, pour chaque MP
        Car le hash de id_mp est trop lourd pour la BDD
        """

        id_mapping = (
            marches.select("id_mp")
            .unique()
            .with_row_index(name="id_mp_integer")  # génère l'entier par valeur unique
        )

        return (
            marches.join(id_mapping, on="id_mp", how="left")
            .drop("id_mp")
            .rename({"id_mp_integer": "id_mp"})
        )

    @staticmethod
    def handle_outlier_amounts(marches: pl.DataFrame) -> pl.DataFrame:
        """Flag and filter aberrant montant values in marches publics.

        - Above 1 billion EUR: the amount is set to null and
          ``montant_aberrant`` is set to True (almost certainly a data
          entry error such as amounts entered in centimes).
        - Between 100 million and 1 billion EUR: the amount is kept but
          ``montant_aberrant`` is set to True (borderline -- may be real
          for large infrastructure contracts but warrants review).
        - Below 100 million EUR: ``montant_aberrant`` is set to False.
        """
        EXTREME_THRESHOLD = 1_000_000_000  # 1 billion
        BORDERLINE_THRESHOLD = 100_000_000  # 100 million

        return marches.with_columns(
            pl.when(pl.col("montant_du_marche_public") > EXTREME_THRESHOLD)
            .then(pl.lit(None).cast(pl.Float64))
            .otherwise(pl.col("montant_du_marche_public"))
            .alias("montant_du_marche_public"),
            pl.when(pl.col("montant_du_marche_public") > BORDERLINE_THRESHOLD)
            .then(pl.lit(True))
            .otherwise(pl.lit(False))
            .alias("montant_aberrant"),
        )

    @staticmethod
    def drop_rows_with_null_dates_or_amounts(marches: pl.DataFrame) -> pl.DataFrame:
        """
        Supprime les lignes où 'date_publication_donnees' ou 'montant' sont nulles.
        """
        return marches.filter(
            pl.col("date_publication_donnees").is_not_null()
            & pl.col("montant_du_marche_public").is_not_null()
        )
