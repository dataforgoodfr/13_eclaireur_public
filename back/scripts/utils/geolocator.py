import io
import logging
import requests
from pathlib import Path
import pandas as pd

from scripts.utils.config import get_project_base_path


class GeoLocator:
    """
    GeoLocator is a class that enriches a DataFrame containing regions, departments, EPCI, and communes with geocoordinates.
    It uses the COG (INSEE code) to retrieve the coordinates of the regions, departments, and communes from various sources: CSV & API.
    One external method is available to add geocoordinates to the DataFrame.
    """

    def __init__(self, geo_config):
        self.logger = logging.getLogger(__name__)
        self._config = geo_config

    def _get_reg_dep_coords(self) -> pd.DataFrame:
        """Return scrapped data for regions and departements."""
        reg_dep_geoloc_df = pd.read_csv(
            Path(self._config["reg_dep_coords_scrapped_data_file"]), sep=";"
        )  # TODO: Use CSVLoader
        if reg_dep_geoloc_df.empty:
            raise Exception("Regions and departements dataset should not be empty.")

        reg_dep_geoloc_df["cog"] = reg_dep_geoloc_df["cog"].astype(str)
        return reg_dep_geoloc_df.drop(columns=["nom"])

    # we are forced to used scrapped this following a break in the BANATIC dataset.
    # see https://data-for-good.slack.com/archives/C08AW9JJ93P/p1739369130352499
    def _get_epci_coords(self) -> pd.DataFrame:
        """Return scrapped data for ECPI."""
        df = pd.read_csv(Path(self._config["epci_coords_scrapped_data_file"]), sep=";")
        if df.empty:
            raise Exception("EPCI coordinates file not found.")

        df = df.drop(columns=["nom"])
        df = df.astype({"latitude": str, "longitude": str})
        return df

    def _request_geolocator_api(self, payload) -> pd.DataFrame:
        """Save payload to CSV to send to API, and return the response as dataframe"""
        payload_filename = self._config["temp_folder"]["filename"]
        payload_path = (
            get_project_base_path() / self._config["temp_folder"]["path"] / payload_filename
        )
        payload.to_csv(payload_path, sep=";", index=False)

        with open(payload_path, "rb") as payload_file:
            data = {
                "citycode": "cog",
                "result_columns": ["cog", "latitude", "longitude", "result_status"],
            }
            files = {"data": (payload_filename, payload_file, "text/csv")}

            response = requests.post(self._config["geolocator_api_url"], data=data, files=files)
            if response.status_code != 200:
                raise Exception(f"Failed to fetch data from geolocator API: {response.text}")

            df = pd.read_csv(io.StringIO(response.text), sep=";")
            df = df[df["result_status"] == "ok"]
            df = df[["cog", "latitude", "longitude"]]
            df.loc[:, "type"] = "COM"
            df = df.astype({"cog": str, "latitude": str, "longitude": str})
            df["cog"] = df["cog"].str.zfill(5)

            return df

    def add_geocoordinates(self, data_frame) -> pd.DataFrame:
        """Function to add geocoordinates to a DataFrame containing regions, departments, EPCI, and communes.
        1. handle regions, departements and CTU from scrapped dataset
        2. handle ECPI from scrapped dataset
        3. handle cities by requesting the geolocator API
        4. merge results"""
        reg_dep_ctu = data_frame[data_frame["type"].isin(["REG", "DEP", "CTU"])].merge(
            self._get_reg_dep_coords(),
            on=["type", "cog"],
            how="left",
        )

        epci = data_frame[~data_frame["type"].isin(["REG", "DEP", "CTU", "COM"])].merge(
            self._get_epci_coords(),
            on=["type", "siren"],
            how="left",
        )

        cities = data_frame[data_frame["type"] == "COM"]
        geolocator_response = self._request_geolocator_api(
            cities[["cog", "nom"]].drop_duplicates()
        )
        cities = cities.merge(geolocator_response, on=["type", "cog"], how="left")

        return pd.concat([reg_dep_ctu, epci, cities])
