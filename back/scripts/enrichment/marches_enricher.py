import json
import typing
from pathlib import Path
import pandas as pd
import polars as pl
from unidecode import unidecode
from inflection import underscore as to_snake_case


from back.scripts.datasets.cpv_labels import CPVLabelsWorkflow
from back.scripts.datasets.marches import MarchesPublicsWorkflow
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.enrichment.utils.cpv_utils import CPVUtils
from back.scripts.utils.dataframe_operation import (
    normalize_date,
    normalize_montant,
)


class MarchesPublicsEnricher(BaseEnricher):
    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def get_dataset_name(cls) -> str:
        return "marches_publics"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> typing.List[Path]:
        return [
            MarchesPublicsWorkflow.get_output_path(main_config),
            CPVLabelsWorkflow.get_output_path(main_config),
        ]

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[pl.DataFrame]) -> pl.DataFrame:
        # Data analysts, please add your code here!
        marches, cpv_labels, *_ = inputs

        marches = (
            marches.pipe(cls.forme_prix_enrich)
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
        )
        marches_pd = (
            marches.to_pandas()
            .pipe(normalize_montant, "montant")
            .pipe(normalize_montant, "montant")
            .pipe(normalize_date, "datePublicationDonnees")
            .pipe(normalize_date, "dateNotification")
            .pipe(cls._add_metadata)
            .assign(montant=lambda df: df["montant"] / df["countTitulaires"].fillna(1))
        )
        # do stuff with sirene

        return (
            pl.from_pandas(marches_pd)
            .pipe(cls.lieu_execution_enrich)
            .pipe(CPVUtils.add_cpv_labels, cpv_labels=cpv_labels)
            .rename(to_snake_case)
        )

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
        """
        1 - Parse lieuExecution en 3 champs code, type code et nom
        2 - Extrait le tout en code commune, code postal, code departement etc
        """

        # TODO : Il y a beaucoup de nettoyage à faire dans les différents champs

        # Cas spécifiques où lieu_execution_type_code est soit bourgogne, soit franche-comte
        mapping = {
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
                    .replace_strict(mapping, default=pl.col("lieu_execution_type_code"))
                    .alias("lieu_execution_type_code")
                )
            )
            .drop("lieu_execution_parsed")
        )

        types = df["lieu_execution_type_code"].drop_nulls().unique().to_list()

        return (
            df.with_columns(
                [
                    pl.when(pl.col("lieu_execution_type_code") == type_code)
                    .then(pl.col("lieu_execution_code"))
                    .otherwise(None)
                    .alias("lieu_execution_" + type_code.replace(" ", "_"))
                    for type_code in types
                ]
            )
            .with_columns(
                pl.when(
                    pl.col("lieu_execution_code_departement").is_null()
                    & (
                        pl.col("lieu_execution_code_postal").is_not_null()
                        | pl.col("lieu_execution_code_commune").is_not_null()
                    )
                )
                .then(
                    pl.coalesce(
                        "lieu_execution_code_postal", "lieu_execution_code_commune"
                    ).str.slice(0, 2)
                )
                .otherwise(pl.col("lieu_execution_code_departement"))
                .alias("lieu_execution_code_departement")
            )
            .drop(["lieu_execution_type_code", "lieu_execution_code", "lieuExecution"])
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
