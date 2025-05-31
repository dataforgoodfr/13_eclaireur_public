from pathlib import Path

from back.scripts.utils.config import get_combined_filename, get_project_base_path


class BaseDataset:
    @classmethod
    def get_config_key(cls) -> str:
        raise NotImplementedError("Method must be overriden")

    @classmethod
    def get_config(cls, main_config: dict) -> dict:
        return main_config[cls.get_config_key()]

    @classmethod
    def get_output_path(cls, main_config: dict) -> Path:
        return get_combined_filename(main_config, cls.get_config_key())

    def __init__(self, main_config: dict, *args, **kwargs):
        self.main_config = main_config
        self.config = self.get_config(main_config)
        self.output_filename = self.get_output_path(main_config)
        self.output_filename.parent.mkdir(exist_ok=True, parents=True)
        if "data_folder" in self.config:
            self.data_folder = get_project_base_path() / self.config["data_folder"]
            self.data_folder.mkdir(exist_ok=True, parents=True)
