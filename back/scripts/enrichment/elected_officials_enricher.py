from pathlib import Path

import polars as pl
from polars import col

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.datasets.elected_officials import ElectedOfficialsWorkflow
from back.scripts.enrichment.base_enricher import BaseEnricher


class ElectedOfficialsEnricher(BaseEnricher):
    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def get_dataset_name(cls) -> str:
        return "elected_officials"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> list[Path]:
        return [
            ElectedOfficialsWorkflow.get_output_path(main_config),
            CommunitiesSelector.get_output_path(main_config),
        ]

    @classmethod
    def _clean_and_enrich(cls, inputs: list[pl.DataFrame]) -> pl.DataFrame:
        elected_officials, communities = inputs
        return (
            elected_officials.pipe(cls._add_code_insee)
            .pipe(cls._add_siren, communities)
            .drop("code_region", "code_commune", "code_dept")
        )

    @classmethod
    def _add_code_insee(cls, df: pl.DataFrame) -> pl.DataFrame:
        return df.with_columns(
            col("mandat")
            .replace_strict(
                {
                    "Conseillers départementaux": "DEP",
                    "Conseillers régionaux": "REG",
                    "Conseillers municipaux": "COM",
                },
                default=None,
            )
            .alias("type")
        ).with_columns(
            pl.when(col("type") == "REG")
            .then(col("code_region"))
            .otherwise(
                pl.when(col("type") == "DEP")
                .then(col("code_dept"))
                .otherwise(col("code_commune"))
            )
            .alias("code_insee")
        )

    @classmethod
    def _add_siren(cls, df: pl.DataFrame, coll: pl.DataFrame) -> pl.DataFrame:
        return df.join(
            coll.select(["siren", "code_insee", "type"]),
            on=["type", "code_insee"],
            how="left",
        ).with_columns(col("siren").fill_null(col("siren_epci")).alias("siren"))
