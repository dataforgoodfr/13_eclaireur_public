import logging

from back.interfaces.workflow import Workflow
from back.scripts.datasets.utils import BaseDataset
from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


class CPVLabelsWorkflow(BaseDataset, Workflow):
    @classmethod
    def get_config_key(cls) -> str:
        return "cpv_labels"

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self) -> None:
        if self.output_filename.exists():
            return
        BaseLoader.loader_factory(self.config["url"]).load().to_parquet(self.output_filename)
