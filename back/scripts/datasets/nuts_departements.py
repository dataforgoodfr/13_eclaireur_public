import logging

from back.scripts.datasets.utils import BaseDataset
from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


class NutsDepartementsWorkflow(BaseDataset):
    @classmethod
    def get_config_key(cls) -> str:
        return "nuts_departements"

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self) -> None:
        if self.output_filename.exists():
            return
        dataset = BaseLoader.loader_factory(self.config["url"]).load()
        dataset["code_departement_insee"] = dataset["code_departement_insee"].astype(str)
        dataset.to_parquet(self.output_filename)

    
