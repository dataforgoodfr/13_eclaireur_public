import logging

from back.scripts.datasets.utils import BaseDataset
from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


class CommunesWorkflow(BaseDataset):
    @classmethod
    def get_config_key(cls) -> str:
        return "communes"

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self) -> None:
        if self.output_filename.exists():
            return
        (
            BaseLoader.loader_factory(self.config["url"])
            .load()
            .astype(
                {
                    "Code INSEE": str,
                    "Code Postal": str,
                    "Commune": str,
                    "Département": str,
                    "Code Département": str,
                    "Région": str,
                    "Code Région": str,
                }
            )
            .to_parquet(self.output_filename)
        )
