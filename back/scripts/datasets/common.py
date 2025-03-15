import logging
from functools import cached_property
from pathlib import Path

from back.scripts.utils.config import project_config


class WorkflowMixin:
    config_key_name: str = ""

    def __init__(self, *args, **kwargs):
        self.data_folder.mkdir(exist_ok=True, parents=True)
        self.logger = logging.getLogger(__name__)

    @cached_property
    def config(self):
        return project_config[self.config_key_name]

    @cached_property
    def url(self) -> str:
        return self.config["url"]

    @cached_property
    def data_folder(self) -> Path:
        return Path(self.config["data_folder"])
