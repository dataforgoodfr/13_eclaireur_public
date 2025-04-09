from pathlib import Path
import pandas as pd

from back.scripts.datasets.dataset_aggregator import LOADER_CLASSES


class AggregateCommunityTable:

    @classmethod
    def get_output_path(cls) -> str:
        return "collectivites_aggregees"


    def __init__(self, config):
        self.config = config

    def aggregate_data(self):
        print("Running AggregateCommunityTable...")
        df_communities = pd.read_parquet(self.config["communities"]["combined_filename"])
        df_financial_accounts = pd.read_parquet(self.config["financial_accounts"]["combined_filename"])
        # print(df_communities.columns)
        df_financial_accounts["code_insee"] = df_financial_accounts["region"].combine_first(df_financial_accounts["dept"])
        df_financial_accounts["code_insee"] = df_financial_accounts["code_insee"].str.lstrip('0')
        df_financial_accounts = df_financial_accounts[["exercice", "code_insee", "subventions"]]
        df_communities = df_communities.merge(df_financial_accounts, on="code_insee", how="left")
        print(df_communities)
        return df_communities


from back.scripts.utils.argument_parser import ArgumentParser
from back.scripts.utils.config_manager import ConfigManager
from back.scripts.utils.logger_manager import LoggerManager

from back.scripts.utils.config import project_config

if __name__ == "__main__":
    # Parse arguments, load config and configure logger
    args = ArgumentParser.parse_args("Gestionnaire du projet LocalOuvert")

    # Load config file
    config = ConfigManager.load_config(args.filename)

    # Load project configuration instance
    project_config.load(config)

    LoggerManager.configure_logger(config)
    AggregateCommunityTable(config).aggregate_data()
