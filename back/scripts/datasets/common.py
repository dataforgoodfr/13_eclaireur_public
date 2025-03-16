from copy import deepcopy
from functools import cached_property
from pathlib import Path

from back.scripts.utils.config import project_config


class DatasetsMixin:
    """
    Subclasses are able to know their default configuration using `config_key_name`.
    You can override the `config` method, as in `TopicAggregator`.
    You can also force the config during `__init__` by explicitly naming it : `Class(config=…)`
    """

    config_key_name: str = ""

    def __init__(
        self, *args, config: dict | None = None, create_data_folder: bool = True, **kwargs
    ):
        if config is not None:
            self.config = config
        if create_data_folder and "data_folder" in self.config:
            self.data_folder.mkdir(exist_ok=True, parents=True)

    @cached_property
    def config(self):
        # Use the default configuration and protect the global configuration
        return deepcopy(project_config[self.config_key_name])

    @cached_property
    def url(self) -> str:
        return self.config["url"]

    @cached_property
    def data_folder(self) -> Path:
        return Path(self.config["data_folder"])
