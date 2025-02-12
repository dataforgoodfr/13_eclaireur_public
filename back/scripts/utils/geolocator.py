import io
import logging
import requests
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

    def _request_geolocator_api(self, request):
        # save to CSV to send to API
        folder = get_project_base_path() / self._config["processed_data_folder"]
        payload_filename = folder / "cities_to_geolocate.csv"
        request.to_csv(payload_filename, sep=";", index=False)

        with open(payload_filename, "rb") as payload:
            data = {
                "citycode": "cog",
                "result_columns": ["cog", "latitude", "longitude", "result_status"],
            }

            # Prepare the file payload
            files = {"data": ("missing_cities_cogs.csv", payload, "text/csv")}

            # Send the POST request
            response = requests.post(self._config["geolocator_api_url"], data=data, files=files)

            if response.status_code != 200:
                raise Exception(f"Failed to fetch data from geolocator API: {response.text}")

            # Convert the CSV string to a pandas DataFrame
            df = pd.read_csv(io.StringIO(response.text), sep=";")
            df = df.loc[df["result_status"] == "ok"]
            df = df[["cog", "latitude", "longitude"]]
            df.loc[:, "type"] = "COM"
            df = df.astype({"cog": str, "latitude": str, "longitude": str})
            df["cog"] = df["cog"].str.zfill(5)

            return df

    # Function to add geocoordinates to a DataFrame containing regions, departments, EPCI, and communes
    def add_geocoordinates(self, data_frame):
        # handle everything but EPCI
        reg_dep_ctu = data_frame.loc[data_frame["type"].isin(["REG", "DEP", "CTU"])]
        reg_dep_ctu = reg_dep_ctu.merge(
            self._get_reg_dep_com_coords(),
            on=["type", "cog"],
            how="left",
        )

        # handle cities
        cities = data_frame.loc[data_frame["type"] == "COM"]
        cities = cities.merge(
            self._get_reg_dep_com_coords(),
            on=["type", "cog"],
            how="left",
        )

        # handle missing cities by requesting the addresse.data.gouv API
        # missing cities include cities with arrondissements. the OFGL dataset only include the main city but not the
        # arrondissments, while the data returned by _get_communes_coords contains only arrondissements.

        # first, identify found cities
        found_cities = cities.loc[~cities["latitude"].isnull()]

        # then missing cities
        missing_cities = cities.loc[cities["latitude"].isnull()].drop(
            columns=["latitude", "longitude"]
        )

        # make request to geolocator API and merge results
        geolocator_response = self._request_geolocator_api(missing_cities[["cog", "nom"]])
        geolocated_missing_cities = missing_cities.merge(
            geolocator_response, on=["type", "cog"], how="left"
        )
        debug = geolocated_missing_cities.loc[geolocated_missing_cities["latitude"].isnull()]
        self.logger.info(f"{debug}")

        # handle EPCI
        epci = data_frame.loc[~data_frame["type"].isin(["REG", "DEP", "CTU", "COM"])]
        epci = epci.merge(
            self._get_epci_coords(),
            on=["type", "siren"],
            how="left",
        )

        df = pd.concat([reg_dep_ctu, found_cities, geolocated_missing_cities, epci])

        return df
