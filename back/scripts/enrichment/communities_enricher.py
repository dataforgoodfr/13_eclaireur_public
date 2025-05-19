import typing
from pathlib import Path

import polars as pl
from datetime import datetime


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

        current_year = datetime.now().year
        target_year = current_year - 2
        return (
            communities.join(
                bareme.filter(pl.col("annee") == target_year).select(
                    ["siren", "mp_score", "subventions_score"]
                ),
                on="siren",
                how="left",
            )
            .with_columns(
                [
                    cls._map_score_to_numeric("mp_score").alias("mp_score_num"),
                    cls._map_score_to_numeric("subventions_score").alias("sub_score_num"),
                ]
            )
            .with_columns(
                [
                    ((pl.col("mp_score_num") + pl.col("sub_score_num")) / 2)
                    .floor()
                    .cast(pl.Int64)
                    .alias("global_score_num"),
                ]
            )
            .with_columns([cls._map_numeric_to_score("global_score_num").alias("global_score")])
            .drop(["mp_score_num", "sub_score_num", "global_score_num"])
        )

    @staticmethod
    def _map_score_to_numeric(column: str) -> pl.Expr:
        mapping = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}
        return pl.col(column).replace_strict(mapping).cast(pl.Int64)

    @staticmethod
    def _map_numeric_to_score(column: str) -> pl.Expr:
        mapping = {1: "A", 2: "B", 3: "C", 4: "D", 5: "E"}
        return pl.col(column).replace_strict(mapping)
