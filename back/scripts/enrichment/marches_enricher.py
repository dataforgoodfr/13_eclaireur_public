from pathlib import Path
import typing
import polars as pl
from back.scripts.datasets.marches import MarchesPublicsWorkflow
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.utils.dataframe_operation import normalize_montant


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
        # Data analysts, please add your code here!
        marches, *_ = inputs
        marches_pd = (
            marches.to_pandas()
            .pipe(normalize_montant, "montant")
            .assign(
                montant=lambda df: df["montant"] / df["countTitulaires"].fillna(1)
            )  # distribute montant evenly when more than one contractor
        )
        return pl.from_pandas(marches_pd)
