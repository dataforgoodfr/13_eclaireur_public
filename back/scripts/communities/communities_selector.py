import logging
import re
from pathlib import Path

import pandas as pd

from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.utils.config import get_project_base_path, project_config
from back.scripts.utils.dataframe_operation import normalize_identifiant
from back.scripts.utils.decorators import tracker
from back.scripts.utils.geolocator import GeoLocator

LOGGER = logging.getLogger(__name__)


class CommunitiesSelector:
    """
    CommunitiesSelector manages and filters data from multiple loaders (OFGL, ODF, Sirene)
    to produce a curated list of French communities.
    It merges, cleans, and enriches datasets with geographic coordinates.
    """

    def __init__(self, config):
        self.config = config

        self.data_folder = get_project_base_path() / config["data_folder"]
        self.data_folder.mkdir(parents=True, exist_ok=True)

        self.combined_filename = Path(self.config["combined_filename"])
        self.combined_filename.parent.mkdir(parents=True, exist_ok=True)

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self):
        if self.combined_filename.exists():
            return
        communities = (
            pd.read_parquet(project_config["ofgl"]["combined_filename"])
            .drop_duplicates(subset=["siren"], keep="first")
            .drop(columns=["exercice"])
            .fillna({"population": 0})
            .pipe(self.add_collectivite_platforms)
            .pipe(self.add_epci_infos)
            .pipe(self.add_sirene_infos)
        )

        communities.to_parquet(self.combined_filename, index=False)

    @tracker(ulogger=LOGGER, log_start=True)
    def add_collectivite_platforms(self, frame: pd.DataFrame) -> pd.DataFrame:
        """
        ODF dataset comes from a 2019 study about how collectivities contributed to the open data movement.
        It is not updated since then and is not representative of the current landscape.
        As a result, it is directly integrated as a CSV in the project to allow updates when needed.
        URL : https://static.data.gouv.fr/resources/donnees-de-lobservatoire-open-data-des-territoires-edition-2022/20230202-112356/indicateurs-odater-organisations-2022-12-31-.csv
        """
        odf = BaseLoader.loader_factory(self.config["odf_url"]).load()
        return frame.merge(odf, on="siren", how="left")

    @tracker(ulogger=LOGGER, log_start=True)
    def add_sirene_infos(self, frame: pd.DataFrame) -> pd.DataFrame:
        sirene = pd.read_parquet(
            project_config["sirene"]["combined_filename"],
            columns=["siren", "naf8", "tranche_effectif", "raison_sociale", "is_active"],
        ).pipe(lambda df: df[df["naf8"].isin(["8411Z", "8710C", "3700Z", "8413Z"])])

        return (
            frame.merge(sirene, on="siren", how="left")
            .pipe(lambda df: df[df["is_active"]])
            .fillna({"tranche_effectif": 0})
            .assign(
                effectifs_sup_50=lambda df: df["tranche_effectif"] >= 50,
                nom=lambda df: df["raison_sociale"],
            )
            .assign(
                should_publish=lambda df: (df["type"] != "COM")
                | ((df["type"] == "COM") & (df["population"] >= 3500) & df["effectifs_sup_50"])
            )
            .drop(columns=["raison_sociale", "is_active"])
            .merge(
                sirene[["siren", "raison_sociale"]].rename(columns={"siren": "siren_epci"}),
                on="siren_epci",
                how="left",
            )
            .rename(columns={"raison_sociale": "nom_epci"})
        )

    def add_epci_infos(self, frame: pd.DataFrame) -> pd.DataFrame:
        epci_mapping = (
            BaseLoader.loader_factory(
                self.config["epci_url"], columns=["siren", "siren_membre"]
            )
            .load()
            .rename(columns={"siren": "siren_epci", "siren_membre": "siren"})
            .pipe(normalize_identifiant, id_col="siren_epci", format="siren")
            .pipe(normalize_identifiant, id_col="siren", format="siren")
        )
        return frame.merge(epci_mapping, on="siren", how="left")

    def load_selected_communities(self):
        selected_data = self.all_data.copy()
        selected_data = selected_data.loc[selected_data["should_publish"]]

        # Add geocoordinates to selected data
        geolocator = GeoLocator(self.config["geolocator"])
        selected_data = geolocator.add_geocoordinates(selected_data).rename(
            columns=lambda col: re.sub(r"[.-]", "_", col.lower())
        )
        self.selected_data = selected_data

    def get_datagouv_ids_to_siren(self):
        """
        Retrieve rows with non-null 'id_datagouv', returning a DataFrame with 'siren' and 'id_datagouv' columns.

        Returns:
            DataFrame: Filtered data containing 'siren' and 'id_datagouv' for valid entries.
        """
        new_instance = self.selected_data.copy()
        datagouv_ids = new_instance[new_instance["id_datagouv"].notnull()][
            ["siren", "id_datagouv"]
        ]
        return datagouv_ids  # return a dataframe with siren and id_datagouv columns

    # Function to retrieve rows with non-null 'siren', returning a DataFrame with 'siren', 'nom', and 'type' columns.
    def get_selected_ids(self):
        new_instance = self.selected_data.copy()
        selected_data_ids = new_instance[new_instance["siren"].notnull()][
            ["siren", "nom", "type"]
        ]
        selected_data_ids.drop_duplicates(
            subset=["siren"], keep="first", inplace=True
        )  # keep only the first duplicated value TODO to be improved
        return selected_data_ids  # return a dataframe with siren and & basic info
