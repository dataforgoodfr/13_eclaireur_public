import logging
import re
from pathlib import Path

import numpy as np
import pandas as pd
from scripts.communities.loaders.odf import OdfLoader
from scripts.communities.loaders.ofgl import OfglLoader
from scripts.communities.loaders.sirene import SireneLoader
from scripts.utils.config import get_project_base_path
from scripts.utils.geolocator import GeoLocator


class CommunitiesSelector:
    """
    CommunitiesSelector manages and filters data from multiple loaders (OFGL, ODF, Sirene)
    to produce a curated list of French communities.
    It merges, cleans, and enriches datasets with geographic coordinates
    while applying selection criteria (e.g., population, effectifs)
    for open data law compliance and project-specific usage.

    Steps:
    1. Load data from OFGL, ODF, and Sirene datasets
    2. Merge OFGL and ODF data on 'siren' column
    3. Merge Sirene data on 'siren' column
    4. Filter data based on legal requirements
    5. Add geocoordinates to selected data
    6. Save all and selected data to CSV
    """

    _instance = None
    _init_done = False

    # Singleton pattern
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(CommunitiesSelector, cls).__new__(cls)
        return cls._instance

    # Constructor TODO: Refactor, too many responsibilities
    def __init__(self, config):
        # Singleton pattern
        if self._init_done:
            return
        self.config = config
        self.logger = logging.getLogger(__name__)

        data_folder = Path(get_project_base_path()) / "data" / "communities" / "processed_data"
        fn = data_folder / "all_communities_data.parquet"
        if fn.exists():
            self.all_data = pd.read_parquet(fn)
        else:
            self.load_all_communities()
            self.all_data.to_parquet(fn)

        fn = data_folder / "selected_communities_data.parquet"
        if fn.exists():
            self.selected_data = pd.read_parquet(fn)
        else:
            self.load_selected_communities()
            self.selected_data.to_parquet(fn)

        self._init_done = True

    def load_all_communities(self):
        # Load data from OFGL, ODF, and Sirene datasets
        ofgl = OfglLoader(self.config["ofgl"])
        odf = OdfLoader(self.config["odf"])
        sirene = SireneLoader(self.config["sirene"])
        ofgl_data = ofgl.get()
        odf_data = odf.get()

        # Prepare & Merge OFGL and ODF data on 'siren' column
        # TODO : If you cast to Int, it breaks
        # TODO : casting seems redundant, check if it's necessary
        # TODO Manage columns outside of classes (configs ?)
        ofgl_data["siren"] = pd.to_numeric(ofgl_data["siren"], errors="coerce")
        ofgl_data["siren"] = ofgl_data["siren"].fillna(0).astype(int)
        odf_data["siren"] = pd.to_numeric(odf_data["siren"], errors="coerce")
        odf_data["siren"] = odf_data["siren"].fillna(0).astype(int)
        all_data = ofgl_data.merge(
            odf_data[["siren", "url_ptf", "url_datagouv", "id_datagouv", "merge", "ptf"]],
            on="siren",
            how="left",
        )
        all_data = all_data[
            [
                "nom",
                "siren",
                "type",
                "cog",
                "cog_3digits",
                "code_departement",
                "code_departement_3digits",
                "code_region",
                "population",
                "epci",
                "url_ptf",
                "url_datagouv",
                "id_datagouv",
                "merge",
                "ptf",
            ]
        ]

        # Merge Sirene data on 'siren' column
        all_data["siren"] = pd.to_numeric(all_data["siren"], errors="coerce")
        all_data["siren"] = all_data["siren"].fillna(0).astype(int)
        all_data = all_data.merge(sirene.get(), on="siren", how="left")

        # Conversion of the 'trancheEffectifsUniteLegale' and 'population' columns to numeric type
        all_data["trancheEffectifsUniteLegale"] = pd.to_numeric(
            all_data["trancheEffectifsUniteLegale"].astype(str), errors="coerce"
        )
        all_data["population"] = pd.to_numeric(
            all_data["population"].astype(str), errors="coerce"
        )

        # Add the variable EffectifsSup50, default legal filter for open data application (50 FTE employees)
        all_data["EffectifsSup50"] = np.where(
            all_data["trancheEffectifsUniteLegale"] > 15, True, False
        )

        # Save all communities data to instance
        self.all_data = all_data

    def load_selected_data(self):
        selected_data = self.all_data.copy()
        selected_data = selected_data.loc[
            (self.all_data["type"] != "COM")
            | (
                (self.all_data["type"] == "COM")
                & (self.all_data["population"] >= 3500)
                & self.all_data["EffectifsSup50"]
            )
        ]

        # Add geocoordinates to selected data
        geolocator = GeoLocator(self.config["geolocator"])
        selected_data = geolocator.add_geocoordinates(selected_data)
        selected_data.columns = [
            re.sub(r"[.-]", "_", col.lower()) for col in selected_data.columns
        ]  # to adjust column for SQL format and ensure consistency
        self.selected_data = selected_data

    def get_datagouv_ids(self):
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
