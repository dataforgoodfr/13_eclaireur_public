from pathlib import Path
import pandas as pd
import numpy as np

from scripts.utils.files_operation import save_csv
from scripts.loaders.base_loader import BaseLoader
from scripts.utils.config import get_project_base_path


class OfglLoader:
    def __init__(self, config):
        # Load data from OFGL dataset if it was already processed
        data_folder = Path(get_project_base_path()) / config["processed_data"]["path"]
        data_file = data_folder / config["processed_data"]["filename"]
        if data_file.exists():
            self.data = pd.read_csv(data_file, sep=";")
        else:
            base_path = get_project_base_path()

            # Load the mapping between EPCI and communes, downloaded from the OFGL website
            epci_communes_path = base_path / config["epci"]["file"]
            epci_communes_mapping = pd.read_excel(
                epci_communes_path, dtype=config["epci"]["dtype"]
            )
            infos_coll = pd.DataFrame()

            # Loop over the different collectivities type (regions, departements, communes, interco)
            for key, url in config["url"].items():
                # Download the data from the OFGL website
                df_loader = BaseLoader.loader_factory(url, dtype=config["dtype"])
                df = df_loader.load()
                # Process the data: keep only the relevant columns and rename them
                if key == "communes":
                    df = self.process_data(df, key, epci_communes_mapping)
                else:
                    df = self.process_data(df, key)

                # Concatenate the dataframes
                infos_coll = pd.concat([infos_coll, df], axis=0, ignore_index=True)

            # Fill NaN values with np.nan
            infos_coll.fillna(np.nan, inplace=True)
            # Save the processed data to the instance & a CSV file
            self.data = infos_coll
            self.save(
                Path(config["processed_data"]["path"]), config["processed_data"]["filename"]
            )

    def get(self):
        return self.data

    def save(self, path, filename):
        save_csv(self.data, path, filename, sep=";", index=True)

    def process_data(self, df, key, epci_communes_mapping=None):
        # Process the data: keep only the relevant columns and rename them
        if key == "regions":
            df = df[
                [
                    "Code Insee 2023 Région",
                    "Nom 2023 Région",
                    "Catégorie",
                    "Code Siren Collectivité",
                    "Population totale",
                ]
            ]
            df.columns = ["COG", "nom", "type", "SIREN", "population"]
            df = df.astype({"SIREN": str, "COG": str})
            df = df.sort_values("COG")

        elif key == "departements":
            df = df[
                [
                    "Code Insee 2023 Région",
                    "Code Insee 2023 Département",
                    "Nom 2023 Département",
                    "Catégorie",
                    "Code Siren Collectivité",
                    "Population totale",
                ]
            ]
            df.columns = ["code_region", "COG", "nom", "type", "SIREN", "population"]
            df.loc[:, "type"] = "DEP"
            df = df.astype({"SIREN": str, "COG": str, "code_region": str})
            df["COG_3digits"] = df["COG"].str.zfill(3)
            df = df[["nom", "SIREN", "type", "COG", "COG_3digits", "code_region", "population"]]
            df = df.sort_values("COG")

        elif key == "communes":
            df = df[
                [
                    "Code Insee 2023 Région",
                    "Code Insee 2023 Département",
                    "Code Insee 2023 Commune",
                    "Nom 2023 Commune",
                    "Catégorie",
                    "Code Siren Collectivité",
                    "Population totale",
                ]
            ]
            df.columns = [
                "code_region",
                "code_departement",
                "COG",
                "nom",
                "type",
                "SIREN",
                "population",
            ]
            df.loc[:, "type"] = "COM"
            df = df.astype({"SIREN": str, "COG": str, "code_departement": str})
            df["code_departement_3digits"] = df["code_departement"].str.zfill(3)
            df = df[
                [
                    "nom",
                    "SIREN",
                    "COG",
                    "type",
                    "code_departement",
                    "code_departement_3digits",
                    "code_region",
                    "population",
                ]
            ]
            df = df.sort_values("COG")
            df = df.merge(
                epci_communes_mapping[["siren", "siren_membre"]],
                left_on="SIREN",
                right_on="siren_membre",
                how="left",
            )
            df = df.drop(columns=["siren_membre"])
            df.rename(columns={"siren": "EPCI"}, inplace=True)

        elif key == "interco":
            df = df[
                [
                    "Code Insee 2023 Région",
                    "Code Insee 2023 Département",
                    "Nature juridique 2023 abrégée",
                    "Code Siren 2023 EPCI",
                    "Nom 2023 EPCI",
                    "Population totale",
                ]
            ]
            df.columns = [
                "code_region",
                "code_departement",
                "type",
                "SIREN",
                "nom",
                "population",
            ]
            df.loc[:, "type"] = df["type"].replace({"MET69": "MET", "MET75": "MET", "M": "MET"})
            df = df.astype({"SIREN": str, "code_departement": str})
            df["code_departement_3digits"] = df["code_departement"].str.zfill(3)
            df = df[
                [
                    "nom",
                    "SIREN",
                    "type",
                    "code_departement",
                    "code_departement_3digits",
                    "code_region",
                    "population",
                ]
            ]
            df = df.sort_values("SIREN")

        return df
