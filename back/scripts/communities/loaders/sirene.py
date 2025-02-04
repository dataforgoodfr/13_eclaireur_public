from pathlib import Path
import pandas as pd

from scripts.utils.config import get_project_base_path

class SireneLoader():
    """
    SireneLoader loads data from the Sirene dataset, 2023.
    Needed to download the dataset from the INSEE website.
    This dataset lists the companies and their characteristics in France.
    
    TODO : Refactor using loaders_factory?
    """
    def __init__(self,config):
        base_path = get_project_base_path()
        data_folder = Path(base_path / config["path"])
        self.data = pd.read_csv( data_folder / config["filename"], usecols=config["columns"])
    
    def get(self):
        return self.data
