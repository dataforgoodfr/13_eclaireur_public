from pathlib import Path
import typing
import polars as pl
from back.scripts.datasets.cpv_labels import CPVLabelsWorkflow
from back.scripts.datasets.marches import MarchesPublicsWorkflow
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.enrichment.utils.cpv_utils import CPVUtils
from back.scripts.utils.dataframe_operation import normalize_montant
import json


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

        marches = cls.forme_prix_enrich(marches)
        marches = cls.type_prix_enrich(marches)

        # do stuff with sirene
        marches_pd = (
            marches.to_pandas()
            .pipe(normalize_montant, "montant")
            .assign(
                montant=lambda df: df["montant"] / df["countTitulaires"].fillna(1)
            )  # distribute montant evenly when more than one contractor
        )
        return pl.from_pandas(marches_pd).pipe(CPVUtils.add_cpv_labels, cpv_labels=cpv_labels)

    @staticmethod
    def forme_prix_enrich(marches: pl.DataFrame) -> pl.DataFrame:
        marches = (
            marches.with_columns(
                pl.when(pl.col("formePrix") == "Ferme, actualisable")
                .then(pl.lit("Ferme et actualisable"))
                .otherwise(pl.col("formePrix"))
            )
            .with_columns(
                pl.when(pl.col("formePrix") == "")
                .then(pl.lit(None))
                .otherwise(pl.col("formePrix"))
            )
            .rename({"formePrix": "forme_prix"})
        )

        return marches

    @staticmethod
    def type_prix_enrich(marches: pl.DataFrame) -> pl.DataFrame:
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

        marches = (
            marches.with_columns(
                pl.col("typesPrix").map_elements(safe_typePrix_json_load, return_dtype=pl.Utf8)
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
        return marches
