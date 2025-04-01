from pathlib import Path
import typing
import polars as pl
from polars import col

from back.scripts.datasets.sirene import SireneWorkflow
from back.scripts.datasets.topic_aggregator import TopicAggregator
from back.scripts.enrichment.base_enricher import BaseEnricher


class SubventionsEnricher(BaseEnricher):
    @classmethod
    def get_dataset_name(cls) -> str:
        return "subventions"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> typing.List[Path]:
        return [
            TopicAggregator.get_output_path(
                TopicAggregator.substitute_config(
                    "subventions", main_config["datafile_loader"]
                ),
                cls.get_dataset_name(),
            ),
            SireneWorkflow.get_output_path(main_config),
        ]

    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[pl.DataFrame]) -> pl.DataFrame:
        """
        Enrich the raw subvention dataset
        """
        subventions, sirene = inputs
        subventions = (
            subventions.with_columns(
                # Transform idAttribuant from siret to siren.
                # Data should already be normalized to 15 caracters.
                col("idAttribuant").str.slice(0, 9).alias("idAttribuant"),
                col("idBeneficiaire").str.slice(0, 9).alias("idBeneficiaire"),
            )
            .join(
                # Give the official sirene name to the attribuant
                sirene.select("siren", "raison_sociale"),
                left_on="idAttribuant",
                right_on="siren",
                how="left",
            )
            .with_columns(
                col("raison_sociale").fill_null(col("nomAttribuant")).alias("nomAttribuant")
            )
            .drop("raison_sociale")
            .join(
                # Give the official sirene name to the beneficiaire
                sirene.rename(lambda col: col + "_beneficiaire"),
                left_on="idBeneficiaire",
                right_on="siren_beneficiaire",
                how="left",
            )
            .with_columns(
                col("raison_sociale_beneficiaire")
                .fill_null(col("nomBeneficiaire"))
                .alias("nomBeneficiaire"),
                col("raison_sociale_beneficiaire")
                .is_not_null()
                .alias("is_valid_siren_beneficiaire"),
            )
            .drop("raison_sociale_beneficiaire")
        )
        return subventions
