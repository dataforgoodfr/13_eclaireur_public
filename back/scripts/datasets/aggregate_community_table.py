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

        df_communities = df_communities.loc[df_communities["type"] == "COM"]

        df_communities_dep = self.get_dep(df_communities, df_financial_accounts)
        df_communities_reg = self.get_reg(df_communities, df_financial_accounts)

        df = pd.concat([df_communities_dep, df_communities_reg])
        df.to_parquet(self.get_output_path(main_config))

    def get_dep(df_communities, df_financial_accounts):

        df_communities = df_communities[["nom", "siren", "type", "code_insee_dept"]]

        df_financial_accounts = df_financial_accounts[["exercice", "dept", "total_produits", "total_charges", "resultat", "subventions"]]
        df_financial_accounts = df_financial_accounts.rename(columns={
            "dept": "code_insee_dept",
            "total_produits": "produits",
            "total_charges": "charges",
            })
        
        df_financial_accounts = df_financial_accounts.loc[~df_financial_accounts["siren"].isnull()]

        df_financial_accounts["code_insee_dept"] = df_financial_accounts["code_insee_dept"].str.lstrip(
            "0"
        )

        df_financial_accounts = df_financial_accounts.groupby(["exercice", "code_insee_dept"]).agg({
            "resultat": "mean",
            "subventions":  "mean",
        })
        df_financial_accounts = df_financial_accounts.reset_index(drop=False)
        
        # df_financial_accounts.columns = df_financial_accounts.columns.map('_'.join).str.strip('_')
        
        df_financial_accounts = df_financial_accounts.rename(columns={
            "resultat": "resultat_moyenne",
            "subventions": "subventions_moyenne",
            })
        
        df = df_communities.merge(
            df_financial_accounts, on="code_insee_dept", how="left"
        )
        del df["code_insee_dept"]

        return df
    
    def get_reg(df_communities, df_financial_accounts):

        df_communities = df_communities[["nom", "siren", "type", "code_insee_region"]]

        df_financial_accounts = df_financial_accounts[["exercice", "region", "total_produits", "total_charges", "resultat", "subventions"]]
        df_financial_accounts = df_financial_accounts.rename(columns={
            "region": "code_insee_region",
            "total_produits": "produits",
            "total_charges": "charges",
            })

        df_financial_accounts["code_insee_region"] = df_financial_accounts["code_insee_region"].str.lstrip(
            "0"
        )

        df_financial_accounts = df_financial_accounts.groupby(["exercice", "code_insee_region"]).agg({
            "resultat": "mean",
            "subventions":  "mean",
        })
        df_financial_accounts = df_financial_accounts.reset_index(drop=False)
        
        # df_financial_accounts.columns = df_financial_accounts.columns.map('_'.join).str.strip('_')
        
        df_financial_accounts = df_financial_accounts.rename(columns={
            "resultat": "resultat_moyenne",
            "subventions": "subventions_moyenne",
            })
        
        df = df_communities.merge(
            df_financial_accounts, on="code_insee_region", how="left"
        )
        del df["code_insee_region"]
        return df