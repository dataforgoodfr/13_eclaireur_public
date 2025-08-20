from datetime import datetime
from pathlib import Path

import polars as pl

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.enrichment.bareme_enricher import BaremeEnricher
from back.scripts.enrichment.base_enricher import BaseEnricher


class CommunitiesEnricher(BaseEnricher):
    @classmethod
    def get_dataset_name(cls) -> str:
        return "communities"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> list[Path]:
        return [
            CommunitiesSelector.get_output_path(main_config),
            BaremeEnricher.get_output_path(main_config),
        ]

    @classmethod
    def _clean_and_enrich(cls, inputs: list[pl.DataFrame]) -> pl.DataFrame:
        communities, bareme = inputs

        current_year = datetime.now().year
        target_year = current_year - 2

        bareme_target = cls.create_global_score(bareme, target_year)
        bareme_prev = cls.create_global_score(bareme, target_year - 1)
        bareme_target = cls.add_global_score_evolution(bareme_target, bareme_prev)

        return communities.join(
            bareme_target.select(
                [
                    "siren",
                    "mp_score",
                    "subventions_score",
                    "global_score",
                    "evolution_global_score",
                ]
            ),
            on="siren",
            how="left",
        )

    @staticmethod
    def _map_score_to_numeric(column: str) -> pl.Expr:
        mapping = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}
        return pl.col(column).replace_strict(mapping).cast(pl.Int64)

    @staticmethod
    def _map_numeric_to_score(column: str) -> pl.Expr:
        mapping = {1: "A", 2: "B", 3: "C", 4: "D", 5: "E"}
        return pl.col(column).replace_strict(mapping)

    @classmethod
    def add_global_score_evolution(
        cls, bareme_target: pl.DataFrame, bareme_prev: pl.DataFrame
    ) -> pl.DataFrame:
        return (
            bareme_target.join(
                bareme_prev.select(["siren", "global_score"]).rename(
                    {"global_score": "global_score_prev"}
                ),
                on="siren",
                how="left",
            )
            .with_columns(
                [
                    pl.when(pl.col("global_score") < pl.col("global_score_prev"))
                    .then(pl.lit("En hausse"))  # valeur plus petite = meilleur score
                    .when(pl.col("global_score") > pl.col("global_score_prev"))
                    .then(pl.lit("En baisse"))
                    .otherwise(pl.lit("Stable"))
                    .alias("evolution_global_score")
                ]
            )
            .drop("global_score_prev")
        )

    @classmethod
    def create_global_score(cls, df: pl.DataFrame, year: int) -> pl.DataFrame:
        df_year = df.filter(pl.col("annee") == year)

        return (
            df_year.with_columns(
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
                    .alias("global_score_num")
                ]
            )
            .with_columns([cls._map_numeric_to_score("global_score_num").alias("global_score")])
            .drop(["mp_score_num", "sub_score_num", "global_score_num"])
        )
