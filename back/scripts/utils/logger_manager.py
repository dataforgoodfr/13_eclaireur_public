import logging
import logging.config
import os


class LoggerManager:
    @staticmethod
    def configure_logger(config: dict) -> None:
        """
        Static method that configures the Python logger given a parsed YAML configuration.

        Args:
            config (dict): Dictionary of a parsed YAML configuration file.

        Returns:
            None
        """
        log_directory = os.path.dirname(config["logging"]["handlers"]["file"]["filename"])
        os.makedirs(log_directory, exist_ok=True)
        logging.config.dictConfig(config["logging"])
