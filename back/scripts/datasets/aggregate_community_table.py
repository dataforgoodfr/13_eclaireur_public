from pathlib import Path
import pandas as pd

from back.scripts.utils.config import get_project_base_path


class AggregateCommunityTable:
    def __init__(self, config):
        self.config = config
        # self.output_path = Path(get_project_base_path()) / "data" / "aggregated_outputs"
        # self.output_path.mkdir(exist_ok=True, parents=True)

    def run(self):
        print("Running AggregateCommunityTable...")

        # # Chargement des fichiers normalisés
        # base_path = Path(get_project_base_path()) / "data" / "datasets"
        # marches = pd.read_csv(base_path / "marches" / "outputs" / "normalized_data.csv", sep=";")
        # decla = pd.read_csv(base_path / "declarations" / "outputs" / "normalized_data.csv", sep=";")
        # fa = pd.read_csv(base_path / "financial_accounts" / "outputs" / "normalized_data.csv", sep=";")
        # communities = pd.read_csv(Path(get_project_base_path()) / "data" / "communities" / "processed_data" / "selected_communities_data.csv", sep=";")

        # # Nettoyage basique
        # marches["siren"] = marches["siren"].astype(str)
        # decla["siren"] = decla["siren"].astype(str)
        # fa["siren"] = fa["siren"].astype(str)
        # communities["siren"] = communities["siren"].astype(str)

        # # Agrégats
        # mp = marches.groupby(["siren", "annee"])["montant"].sum().reset_index(name="total_mp")
        # sd = decla.groupby(["siren", "annee"])["montant"].sum().reset_index(name="subvention_declaree")
        # sfa = fa.groupby(["siren", "annee"])[["budget_total", "subvention_budget"]].sum().reset_index()

        # # Jointure avec collectivités
        # df = communities.merge(mp, on="siren", how="left")
        # df = df.merge(sd, on="siren", how="left")
        # df = df.merge(sfa, on="siren", how="left")

        # # Moyennes par type/année/région/département (à affiner selon types)
        # def moyenne(df, col, by):
        #     return df.groupby(by)[col].transform("mean")

        # df["mp_moy_nationale"] = moyenne(df, "total_mp", ["annee", "type"])
        # df["mp_moy_regionale"] = moyenne(df, "total_mp", ["annee", "type", "code_region"])
        # df["mp_moy_departementale"] = moyenne(df, "total_mp", ["annee", "type", "code_departement"])
        # df["subv_moy_nationale"] = moyenne(df, "subvention_budget", ["annee", "type"])
        # df["subv_moy_regionale"] = moyenne(df, "subvention_budget", ["annee", "type", "code_region"])
        # df["subv_moy_departementale"] = moyenne(df, "subvention_budget", ["annee", "type", "code_departement"])

        # # Table finale
        # final = df[[
        #     "nom", "siren", "type", "annee",
        #     "budget_total", "subvention_budget",
        #     "subvention_declaree", "total_mp",
        #     "mp_moy_nationale", "mp_moy_regionale", "mp_moy_departementale",
        #     "subv_moy_nationale", "subv_moy_regionale", "subv_moy_departementale"
        # ]]

        # # save_csv(final, self.output_path, "aggregated_community_table.csv", sep=";")
        # print("Aggregated table saved.")


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
    AggregateCommunityTable(config).run()
