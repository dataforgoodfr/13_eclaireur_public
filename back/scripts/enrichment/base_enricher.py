from pathlib import Path
import typing

import pandas as pd
from back.scripts.utils.config import get_project_base_path


class BaseEnricher:
    """Designed to be subclassed, subclasses must override get_dataset_name and get_input_paths and _clean_and_enrich."""

    @classmethod
    def get_dataset_name() -> str:
        raise NotImplementedError("Method must be overriden")

    @classmethod
    def get_input_paths(cls, _main_config: dict) -> typing.List[Path]:
        raise NotImplementedError("Method must be overriden")

    @classmethod
    def _clean_and_enrich(cls, _main_config: dict) -> typing.List[Path]:
        raise NotImplementedError("Method must be overriden")

    @classmethod
    def get_output_path(cls, main_config: dict) -> Path:
        return (
            get_project_base_path()
            / main_config["warehouse"]["data_folder"]
            / f"{cls.get_dataset_name()}.parquet"
        )

    @classmethod
    def enrich(cls, main_config: dict) -> None:
        inputs = map(pd.read_parquet, cls.get_input_paths())
        output = cls._clean_and_enrich(inputs)
        output.to_parque(cls.get_output_path(main_config))
