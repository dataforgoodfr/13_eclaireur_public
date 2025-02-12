import logging
from pathlib import Path
import pandas as pd

from scripts.utils.config import get_project_base_path
from scripts.loaders.csv_loader import CSVLoader


class GeoLocator:
    """
    GeoLocator is a class that enriches a DataFrame containing regions, departments, EPCI, and communes with geocoordinates.
    It uses the COG (INSEE code) to retrieve the coordinates of the regions, departments, and communes from various sources: CSV & API.
    One external method is available to add geocoordinates to the DataFrame.
    """

    def __init__(self, geo_config):
        self.logger = logging.getLogger(__name__)
        self._config = geo_config

    def _get_reg_dep_coords(self):
        # Load the data only once during the instance initialization
        data_folder = (
            Path(get_project_base_path())
            / "back"
            / "data"
            / "communities"
            / "scrapped_data"
            / "geoloc"
        )
        reg_dep_geoloc_filename = "dep_reg_centers.csv"  # TODO: To add to config
        reg_dep_geoloc_df = pd.read_csv(
            data_folder / reg_dep_geoloc_filename, sep=";"
        )  # TODO: Use CSVLoader
        if reg_dep_geoloc_df.empty:
            raise Exception("Regions and departements coordinates file not found.")

        reg_dep_geoloc_df["cog"] = reg_dep_geoloc_df["cog"].astype(str)
        reg_dep_geoloc_df = reg_dep_geoloc_df.drop(columns=["nom"])
        return reg_dep_geoloc_df

    def _get_epci_coords(self):
        df = pd.read_csv(Path(self._config["epci_coords_scrapped_data_file"]), sep=";")
        if df.empty:
            raise Exception("EPCI coordinates file not found.")

        df = df.drop(columns=["nom"])
        return df

    def _get_communes_coords(self):
        communes_coords_loader = CSVLoader(self._config["communes_coords_url"])
        df = communes_coords_loader.load()
        df = df[["code_commune_INSEE", "latitude", "longitude"]]
        df.columns = ["cog", "latitude", "longitude"]
        df = df.astype({"cog": str, "latitude": str, "longitude": str})
        df = df.sort_values("cog")
        df.loc[:, "type"] = "COM"
        return df

    # get regions, departements, communes coordinates, for which we join on cog
    def _get_reg_dep_com_coords(self):
        return pd.concat([self._get_reg_dep_coords(), self._get_communes_coords()])

    # Function to add geocoordinates to a DataFrame containing regions, departments, EPCI, and communes
    def add_geocoordinates(self, data_frame):
        # handle everything but EPCI
        non_epci = data_frame.loc[data_frame["type"].isin(["REG", "DEP", "CTU", "COM"])]
        non_epci = non_epci.merge(
            self._get_reg_dep_com_coords(),
            on=["type", "cog"],
            how="left",
        )

        # handle EPCI
        epci = data_frame.loc[~data_frame["type"].isin(["REG", "DEP", "CTU", "COM"])]
        epci = epci.merge(
            self._get_epci_coords(),
            on=["type", "siren"],
            how="left",
        )

        df = pd.concat([non_epci, epci])
        return df
