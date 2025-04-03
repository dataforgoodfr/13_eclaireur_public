from pathlib import Path
import typing
import polars as pl
from back.scripts.datasets.marches import MarchesPublicsWorkflow
from back.scripts.enrichment.base_enricher import BaseEnricher


class MarchesPublicsEnricher(BaseEnricher):
    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def get_dataset_name(cls) -> str:
        return "marches_publics"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> typing.List[Path]:
        return [MarchesPublicsWorkflow.get_output_path(main_config)]

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[pl.DataFrame]) -> pl.DataFrame:
        marches, *_ = inputs
        # TODO casting temporaire de titulaire_id en String, il faudra modifier le fichier source
        marches = marches.with_columns(
            pl.col("titulaire_id").cast(pl.String).alias("titulaire_id")
        )

        marches = cls.type_identifiant_titulaire_enrich(marches)
        return marches

    @staticmethod
    def type_identifiant_titulaire_enrich(marches: pl.DataFrame) -> pl.DataFrame:
        """
        Normalize titulaire_typeIdentifiant column from titulaire_typeIdentifiant and titulaire_id.
        """

        # TODO : Il y a encore environ 600 titulaire_typeIdentifiant avec des titulaire_id non null qui sont null
        SIRET_REGEX = r"^\d{14}$"  # 14 chiffres uniquement
        SIREN_REGEX = r"^\d{9}$"  # 9 chiffres uniquement
        TVA_REGEX = r"^[A-Z]{2}\d{9,12}$"  # Ex: GB123456789 ou FR12345678912

        marches = (
            marches.with_columns(
                pl.when(pl.col("titulaire_typeIdentifiant") == "HORS_UE")
                .then(pl.lit("HORS-UE"))
                .otherwise(pl.col("titulaire_typeIdentifiant"))
                .alias("titulaire_typeIdentifiant")
            )
            .with_columns(
                pl.when(pl.col("titulaire_typeIdentifiant") == "TVA_INTRACOMMUNAUTAIRE")
                .then(pl.lit("TVA"))
                .otherwise(pl.col("titulaire_typeIdentifiant"))
                .alias("titulaire_typeIdentifiant")
            )
            .with_columns(
                pl.when(pl.col("titulaire_typeIdentifiant") == "FRW")
                .then(pl.lit("FRWF"))
                .otherwise(pl.col("titulaire_typeIdentifiant"))
                .alias("titulaire_typeIdentifiant")
            )
            .with_columns(
                pl.when(pl.col("titulaire_typeIdentifiant") == "UE")
                .then(pl.lit("TVA"))
                .otherwise(pl.col("titulaire_typeIdentifiant"))
                .alias("titulaire_typeIdentifiant")
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
                .alias("titulaire_typeIdentifiant")
            )
        )

        return marches
