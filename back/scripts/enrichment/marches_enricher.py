import json
import typing
from pathlib import Path

import polars as pl
from inflection import underscore as to_snake_case

from back.scripts.datasets.cpv_labels import CPVLabelsWorkflow
from back.scripts.datasets.marches import MarchesPublicsWorkflow
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.enrichment.utils.cpv_utils import CPVUtils
from back.scripts.utils.dataframe_operation import normalize_montant


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
            .pipe(cls.type_prix_enrich)
            .pipe(cls.type_identifiant_titulaire_enrich)
        )

        # do stuff with sirene
        marches_pd = (
            marches.to_pandas()
            .pipe(normalize_montant, "montant")
            .assign(
                montant=lambda df: df["montant"] / df["countTitulaires"].fillna(1)
            )  # distribute montant evenly when more than one contractor
        )
        return (
            pl.from_pandas(marches_pd)
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
            return None

    @staticmethod
    def type_prix_enrich(marches: pl.DataFrame) -> pl.DataFrame:
        return (
            marches.with_columns(
                pl.col("typesPrix").map_elements(
                    MarchesPublicsEnricher.safe_typePrix_json_load, return_dtype=pl.Utf8
                )
            )
            .with_columns(
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
        Normalize titulaire_typeIdentifiant column from titulaire_typeIdentifiant and titulaire_id.
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
        marches = marches

        marches = (
            marches.with_columns(
                pl.when(pl.col("titulaire_typeIdentifiant").is_not_null()).then(
                    pl.col("titulaire_typeIdentifiant").replace_strict(
                        mapping, default=pl.col("titulaire_typeIdentifiant")
                    )
                )
            )
            .with_columns(
                pl.when(
                    pl.col("titulaire_typeIdentifiant").is_null()
                    & pl.col("titulaire_id").str.contains(SIRET_REGEX)
                )
                .then(pl.lit("SIRET"))
                .otherwise(pl.col("titulaire_typeIdentifiant"))
                .alias("titulaire_typeIdentifiant")
            )
            .with_columns(
                pl.when(
                    pl.col("titulaire_typeIdentifiant").is_null()
                    & pl.col("titulaire_id").str.contains(SIREN_REGEX)
                )
                .then(pl.lit("SIREN"))
                .otherwise(pl.col("titulaire_typeIdentifiant"))
                .alias("titulaire_typeIdentifiant")
            )
            .with_columns(
                pl.when(
                    pl.col("titulaire_typeIdentifiant").is_null()
                    & pl.col("titulaire_id").str.contains(TVA_REGEX)
                )
                .then(pl.lit("TVA"))
                .otherwise(pl.col("titulaire_typeIdentifiant"))
                .alias("titulaire_type_identifiant")
            )
            .drop("titulaire_typeIdentifiant")
        )

        return marches
