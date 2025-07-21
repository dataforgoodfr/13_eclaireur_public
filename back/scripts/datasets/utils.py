from pathlib import Path

from back.scripts.utils.config import Config, get_project_base_path


class BaseDataset:
    """
    Base class for dataset definitions.
    Provides methods to retrieve dataset config.
    """

    @classmethod
    def get_config_key(cls) -> str:
        """
        Must be implemented by dataset subclasses to return their config key.
        Raises:
            NotImplementedError: if the method has not been overridden.
        """
        raise NotImplementedError("Method must be overridden")

    @classmethod
    def get_config(cls, main_config: dict | Config) -> dict:
        return main_config[cls.get_config_key()]

    @classmethod
    def get_output_path(cls, main_config: dict | Config) -> Path:
        return get_project_base_path() / cls.get_config(main_config)["combined_filename"]

    def __init__(self, main_config: dict, *args, **kwargs):
        self.main_config = main_config
        self.config = self.get_config(main_config)
        self.output_filename = self.get_output_path(main_config)
        self.output_filename.parent.mkdir(exist_ok=True, parents=True)
        if "data_folder" in self.config:
            self.data_folder = get_project_base_path() / self.config["data_folder"]
            self.data_folder.mkdir(exist_ok=True, parents=True)
