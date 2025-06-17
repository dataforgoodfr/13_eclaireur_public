from pathlib import Path
from typing import Self


def get_project_base_path():
    current_directory = Path.cwd()
    return current_directory


def get_project_data_path():
    return get_project_base_path() / "back" / "data"


class Config:
    _instance: Self | None = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(Config, cls).__new__(cls)
        return cls._instance

    def __init__(self, conf: dict | None):
        self._locked = False
        if conf is not None:
            self.load(conf)

    def __getattr__(self, name):
        return self.__getitem__(name)

    def __getitem__(self, name):
        if hasattr(self, "_conf"):
            return self._conf[name]
        raise AttributeError("self._conf not found. Did you forget to .load the instance ?")

    def load(self, conf: dict) -> None:
        if self._locked:
            raise RuntimeError(
                "The configuration has already been loaded and can no longer be modified."
            )
        self._conf = conf
        self._locked = True


# At this stage, the instance is created without configuration because the conf file has not yet been loaded
project_config = Config(None)
