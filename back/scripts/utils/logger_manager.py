import logging
import logging.config
import os

class LoggerManager:
    @staticmethod
    def configure_logger(config):
        log_directory = os.path.dirname(config['logging']['handlers']['file']['filename'])
        os.makedirs(log_directory, exist_ok=True)
        logging.config.dictConfig(config['logging'])