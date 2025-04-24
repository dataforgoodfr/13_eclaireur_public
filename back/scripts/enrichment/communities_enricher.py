from pathlib import Path
import typing
import polars as pl

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.enrichment.bareme_enricher import BaremeEnricher


class CommunitiesEnricher(BaseEnricher):
    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def get_dataset_name(cls) -> str:
        return "communities"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> typing.List[Path]:
        return [
            CommunitiesSelector.get_output_path(main_config),
            BaremeEnricher.get_output_path(main_config),
        ]

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[pl.DataFrame]) -> pl.DataFrame:
        communities, bareme = inputs
        communities = communities.join(
            bareme.filter(pl.col("annee") == 2024).select(
                ["siren", "mp_score", "subventions_score"]
            ),
            on="siren",
            how="left",
        )

        mp_score_expr = (
            pl.when(pl.col("mp_score") == "A")
            .then(1)
            .when(pl.col("mp_score") == "B")
            .then(2)
            .when(pl.col("mp_score") == "C")
            .then(3)
            .when(pl.col("mp_score") == "D")
            .then(4)
            .when(pl.col("mp_score") == "E")
            .then(5)
            .otherwise(None)
            .cast(pl.Int64)
            .alias("mp_score_num")
        )

        sub_score_expr = (
            pl.when(pl.col("subventions_score") == "A")
            .then(1)
            .when(pl.col("subventions_score") == "B")
            .then(2)
            .when(pl.col("subventions_score") == "C")
            .then(3)
            .when(pl.col("subventions_score") == "D")
            .then(4)
            .when(pl.col("subventions_score") == "E")
            .then(5)
            .otherwise(None)
            .cast(pl.Int64)
            .alias("sub_score_num")
        )

        communities = communities.with_columns(
            [mp_score_expr.alias("mp_score_num"), sub_score_expr.alias("sub_score_num")]
        )

        communities = communities.with_columns(
            [
                pl.col("mp_score_num").alias("mp_score_num"),
                pl.col("sub_score_num").alias("sub_score_num"),
            ]
        )

        communities = communities.with_columns(
            [
                ((pl.col("mp_score_num") + pl.col("sub_score_num")) / 2)
                .floor()
                .cast(pl.Int64)
                .alias("global_score")
            ]
        )

        return communities.select(
            [col for col in communities.columns if not col.endswith("_num")]
        )
