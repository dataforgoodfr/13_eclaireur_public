import logging
from pathlib import Path

import polars as pl
from polars import col

from back.scripts.datasets.sirene import SireneWorkflow
from back.scripts.datasets.topic_aggregator import TopicAggregator
from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


class SubventionsEnricher:
    @classmethod
    def get_dataset_name(cls) -> str:
        return "subventions"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> list[Path]:
        return [
            TopicAggregator.get_output_path(
                TopicAggregator.substitute_config(
                    "subventions", main_config["datafile_loader"]
                ),
                cls.get_dataset_name(),
            ),
            SireneWorkflow.get_output_path(main_config),
        ]

    @classmethod
    def get_output_path(cls, main_config: dict) -> Path:
        return (
            get_project_base_path()
            / main_config["warehouse"]["data_folder"]
            / f"{cls.get_dataset_name()}.parquet"
        )

    @classmethod
    @tracker(ulogger=LOGGER, log_start=True)
    def enrich(cls, main_config: dict) -> None:
        inputs = map(pl.scan_parquet, cls.get_input_paths(main_config))
        output = cls._clean_and_enrich(inputs)
        output.sink_parquet(cls.get_output_path(main_config))

    @classmethod
    def _clean_and_enrich(cls, inputs: list[pl.DataFrame]) -> pl.DataFrame:
        """
        Enrich the raw subvention dataset
        """
        subventions, sirene = inputs
        subventions = (
            subventions.with_columns(
                # Transform idAttribuant from siret to siren.
                # Data should already be normalized to 15 caracters.
                col("id_attribuant").str.slice(0, 9).alias("id_attribuant"),
                col("id_beneficiaire").str.slice(0, 9).alias("id_beneficiaire"),
                col("annee").cast(pl.Int64),
            )
            .join(
                # Give the official sirene name to the attribuant
                sirene.select("siren", "raison_sociale"),
                left_on="id_attribuant",
                right_on="siren",
                how="left",
            )
            .with_columns(
                col("raison_sociale").fill_null(col("nom_attribuant")).alias("nom_attribuant")
            )
            .drop("raison_sociale")
            .join(
                # Give the official sirene name to the beneficiaire
                sirene.rename(lambda col: col + "_beneficiaire"),
                left_on="id_beneficiaire",
                right_on="siren_beneficiaire",
                how="left",
            )
            .with_columns(
                col("raison_sociale_beneficiaire")
                .fill_null(col("nom_beneficiaire"))
                .alias("nom_beneficiaire"),
                col("raison_sociale_beneficiaire")
                .is_not_null()
                .alias("is_valid_siren_beneficiaire"),
            )
            .drop("raison_sociale_beneficiaire")
        )
        return subventions
