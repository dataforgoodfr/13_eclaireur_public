from pathlib import Path

import yaml


class ConfigManager:
    @staticmethod
    def load_config(filename: str | Path) -> dict:
        """
        Static method that opens the yaml file given in argument and parses it into a dictionary.

        Args:
            filename (str | Path): path to the yaml configuration file.

        Returns:
            dict: Parsed configuration.
        """
        with open(filename, "r") as f:
            config = yaml.safe_load(f)
        return config
