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

        marches = marches.pipe(cls.forme_prix_enrich).pipe(cls.type_prix_enrich)

        # Deduplicate à pipe avec la ligne au dessus quand ce sera prêt
        marches = marches.pipe(cls.set_unique_id).pipe(cls.drop_source_duplicates)

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
        return marches.with_columns(
            pl.when(pl.col("formePrix") == "Ferme, actualisable")
            .then(pl.lit("Ferme et actualisable"))
            .when(pl.col("formePrix") == "")
            .then(pl.lit(None))
            .otherwise(pl.col("formePrix"))
            .alias("forme_prix")
        )

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
    def set_unique_id(marches: pl.DataFrame) -> pl.DataFrame:
        return marches.with_columns(
            pl.concat_str(
                ["id", "uid", "uuid", "dateNotification", "codeCPV", "titulaire_id"],
                separator="-",
                ignore_nulls=True,
            ).alias("iduiduuiddncpvtid")
        )

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
    def drop_source_duplicates(marches: pl.DataFrame) -> pl.DataFrame:
        # Déplucate les MP identiques qui viennent de sources différentes.

        # Dataset of sources by frequency to build priority when deduplicating
        source_priority = (
            marches.filter(pl.col("source").is_not_null())
            .group_by("source")
            .count()
            .sort("count", descending=True)
            .with_row_index(name="priority")
            .drop("count")
        )

        # A checker a quel point ça impacte les cas avec modifications non null
        return (
            marches.with_columns([pl.col("source").is_null().cast(int).alias("source_is_null")])
            .join(source_priority, on="source", how="left")
            .with_columns([pl.col("priority").fill_null(999)])
            .with_columns(
                [
                    pl.col("priority")
                    .rank("dense", descending=False)
                    .over("iduiduuiddncpvtid")
                    .alias("rank")
                ]
            )
            .with_columns([(pl.col("rank") > 1).cast(pl.Int8).alias("is_duplicate")])
            .filter(pl.col("is_duplicate") == 0)
            .drop(["is_duplicate", "rank", "priority", "source_is_null"])
        )
