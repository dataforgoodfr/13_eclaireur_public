import logging
from pathlib import Path

from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.utils.config import get_combined_filename
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


class CPVLabelsWorkflow:
    @classmethod
    def get_config_key(cls) -> str:
        return "cpv_labels"

    @classmethod
    def get_output_path(cls, main_config: dict) -> Path:
        return get_combined_filename(main_config, cls.get_config_key())

    def __init__(self, main_config: dict):
        self._config = main_config[self.get_config_key()]
        self._output_filename = self.get_output_path(main_config)
        self._output_filename.parent.mkdir(exist_ok=True, parents=True)

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self) -> None:
        if self._output_filename.exists():
            return
        BaseLoader.loader_factory(self._config["url"]).load().to_parquet(self._output_filename)
