import datetime
import json
import logging
import logging.config
import os
from pathlib import Path

from back.scripts.utils.config import get_project_base_path


class JsonlFormatter(logging.Formatter):
    def format(self, record):
        log = {
            "timestamp": getattr(
                record, "timestamp", datetime.datetime.utcnow().isoformat() + "Z"
            ),
            "error_code": getattr(record, "error_code", "UNKNOWN"),
            "message": record.getMessage(),
            "file_url": getattr(record, "file_url", None),
            "dataset": getattr(record, "dataset", None),
            "step": getattr(record, "step", None),
            "details": getattr(record, "details", {}),
        }
        return json.dumps(log, ensure_ascii=False)


class LoggerManager:
    @staticmethod
    def configure_logger(config):
        # Logger principal configuré via dictConfig
        log_directory = os.path.dirname(config["logging"]["handlers"]["file"]["filename"])
        os.makedirs(log_directory, exist_ok=True)
        logging.config.dictConfig(config["logging"])

        # Logger structuré JSONL pour les erreurs
        error_log_path = Path(
            config.get("logging", {}).get(
                "errors_filename", get_project_base_path() / "errors.jsonl"
            )
        )
        error_log_path.parent.mkdir(parents=True, exist_ok=True)

        handler = logging.FileHandler(error_log_path, mode="a", encoding="utf-8")
        handler.setFormatter(JsonlFormatter())

        error_logger = logging.getLogger("errors_logger")
        error_logger.setLevel(logging.ERROR)
        error_logger.addHandler(handler)
        error_logger.propagate = False
