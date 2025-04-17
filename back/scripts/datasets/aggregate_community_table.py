import pandas as pd

# from back.scripts.workflow.data_warehouse import DataWarehouseWorkflow
from back.scripts.utils.config import get_project_base_path


class AggregateCommunityTable:

    @classmethod
    def get_config_key(cls) -> str:
        return "declarations_interet"


    @classmethod
    def get_output_path(cls, main_config) -> str:
        return (
            get_project_base_path()
            / main_config[cls.get_config_key()]["data_folder"]
            / "collectivites_aggregees.parquet"
        )

    @classmethod
    def aggregate_data(self, main_config: dict):
        print("Running AggregateCommunityTable...")
        df_communities = pd.read_parquet(main_config["communities"]["combined_filename"])
        print(df_communities)
        print(df_communities.columns)
        df_financial_accounts = pd.read_parquet(
            main_config["financial_accounts"]["combined_filename"]
        )
        raise
        print(df_financial_accounts)
        print(df_financial_accounts.columns)
        df_financial_accounts["code_insee"] = df_financial_accounts["region"].combine_first(
            df_financial_accounts["dept"]
        )
        df_financial_accounts["code_insee"] = df_financial_accounts["code_insee"].str.lstrip(
            "0"
        )
        df_financial_accounts = df_financial_accounts[["exercice", "code_insee", "subventions"]]
        df = df_communities.merge(
            df_financial_accounts, on="code_insee", how="left"
        )
        print(df)
        df.write_parquet(self.get_output_path(main_config))



