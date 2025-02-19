import pandas as pd
from tqdm import tqdm

from back.scripts.loaders.csv_loader import CSVLoader
from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.datagouv_api import dataset_resources


class ElusWorkflow:
    def __init__(self):
        self.data_folder = get_project_base_path() / "back" / "data" / "elus"
        self.data_folder.mkdir(exist_ok=True, parents=True)

        self.raw_data_folder = self.data_folder / "raw"
        self.raw_data_folder.mkdir(exist_ok=True, parents=True)

        self.processed_data_folder = self.data_folder / "processed"
        self.processed_data_folder.mkdir(exist_ok=True, parents=True)

        self.dataset_id = "5c34c4d1634f4173183a64f1"

    def fetch_raw_datasets(self):
        resources = dataset_resources(self.dataset_id, savedir=self.data_folder)
        for _, resource in tqdm(resources.iterrows()):
            filename = self.raw_data_folder / f"{resource['resource_id']}.parquet"
            if filename.exists():
                continue
            df = CSVLoader(resource["resource_url"]).load()
            df.to_parquet(filename)

    def combine_datasets(self):
        resources = dataset_resources(self.dataset_id, savedir=self.data_folder)
        print(resources.columns)
        for _, resource in tqdm(resources.iterrows()):
            df = pd.read_parquet(self.raw_data_folder / f"{resource['resource_id']}.parquet")
            print(
                resource["resource_id"],
                resource["resource_description"],
            )
            print(df.columns)
        pass


if __name__ == "__main__":
    workflow = ElusWorkflow()
    workflow.fetch_raw_datasets()
    workflow.combine_datasets()
