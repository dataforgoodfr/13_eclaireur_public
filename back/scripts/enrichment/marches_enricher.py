from pathlib import Path
import typing
import pandas as pd
from back.scripts.datasets.marches import MarchesPublicsWorkflow
from back.scripts.enrichment.base_enricher import BaseEnricher


class MarchesPublicsEnricher(BaseEnricher):
    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def get_dataset_name() -> str:
        return "marches_publics"

    @classmethod
    def get_input_paths(cls, main_config: dict):
        return [MarchesPublicsWorkflow.get_output_path(main_config)]

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[Path]) -> pd.DataFrame:
        marches, *_ = inputs
        # Data analysts, please add your code here!
        return marches
