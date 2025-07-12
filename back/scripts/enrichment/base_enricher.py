import logging
from pathlib import Path

import polars as pl

from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


class BaseEnricher:
    """Designed to be subclassed, subclasses must override get_dataset_name and get_input_paths and _clean_and_enrich."""

    @classmethod
    def get_dataset_name(cls) -> str:
        raise NotImplementedError("Method must be overriden")

    @classmethod
    def get_input_paths(cls, main_config: dict) -> list[Path]:
        raise NotImplementedError("Method must be overriden")

    @classmethod
    def _clean_and_enrich(cls, inputs: list[pl.DataFrame]) -> pl.DataFrame:
        raise NotImplementedError("Method must be overriden")

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
        inputs = map(pl.read_parquet, cls.get_input_paths(main_config))
        output = cls._clean_and_enrich(inputs)
        output.write_parquet(cls.get_output_path(main_config))
