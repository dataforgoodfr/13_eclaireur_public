import logging
from pathlib import Path

import numpy as np
import pandas as pd
from scripts.loaders.base_loader import BaseLoader
from scripts.utils.config import get_project_base_path
from scripts.utils.files_operation import save_csv


class OfglLoader:
    def __init__(self, config):
        self._config = config
        self._logger = logging.getLogger(__name__)

    def get(self):
        base_path = get_project_base_path()
        data_folder = Path(base_path) / self._config["processed_data"]["path"]
        data_file = data_folder / self._config["processed_data"]["filename"]

        # Load data from OFGL dataset if it was already processed
        if data_file.exists():
            self._logger.info("Found OFGL data on disk, loading it.")
            return pd.read_csv(data_file, sep=";")

        self._logger.info("Downloading and processing OFGL data.")
        # Load the mapping between EPCI and communes, downloaded from the OFGL website
        epci_communes_path = base_path / self._config["epci"]["file"]
        epci_communes_mapping = pd.read_excel(
            epci_communes_path, dtype=self._config["epci"]["dtype"]
        )
        dataframes = []

        # Loop over the different collectivities type (regions, departements, communes, interco)
        for key, url in self._config["url"].items():
            # Download the data from the OFGL website
            df_loader = BaseLoader.loader_factory(url, dtype=self._config["dtype"])
            df = df_loader.load()
            # Process the data: keep only the relevant columns and rename them
            if key == "regions":
                df = self._process_regions(df)
            elif key == "departements":
                df = self._process_departements(df)
            elif key == "intercos":
                df = self._process_intercos(df)
            elif key == "communes":
                df = self._process_communes(df, epci_communes_mapping)
            else:
                raise ValueError("Unknown key", key)

            dataframes.append(df)

        # Concatenate the dataframes
        data = pd.concat(dataframes, axis=0, ignore_index=True)
        # Fill NaN values with np.nan
        data.fillna(np.nan, inplace=True)
        # Save the processed data to the instance & a CSV file
        save_csv(
            data,
            Path(self._config["processed_data"]["path"]),
            self._config["processed_data"]["filename"],
            sep=";",
            index=True,
        )
        return data

    def _process_regions(self, df):
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
        return df

    def _process_departements(self, df):
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
        return df

    def _process_communes(self, df, epci_communes_mapping):
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
        return df

    def _process_intercos(self, df):
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
