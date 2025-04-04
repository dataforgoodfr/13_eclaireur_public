import io
import logging
from pathlib import Path

import pandas as pd
import requests

from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.dataframe_operation import IdentifierFormat, normalize_identifiant

LOGGER = logging.getLogger(__name__)


class GeoLocator:
    """
    GeoLocator is a class that enriches a DataFrame containing regions, departments, EPCI, and communes with geocoordinates.
    It uses the code_insee (INSEE code) to retrieve the coordinates of the regions, departments, and communes from various sources: CSV & API.
    One external method is available to add geocoordinates to the DataFrame.
    """

    def __init__(self, geo_config: dict):
        self._config = geo_config

    def _get_reg_dep_coords(self) -> pd.DataFrame:
        """Return scrapped data for regions and departements."""
        # TODO: Use CSVLoader
        reg_dep_geoloc_df = (
            pd.read_csv(
                Path(self._config["reg_dep_coords_scrapped_data_file"]),
                sep=";",
                dtype={"cog": str},
                decimal=",",
            )
            .drop(columns=["nom"])
            .rename(columns={"cog": "code_insee"})
        )
        if reg_dep_geoloc_df.empty:
            raise Exception("Regions and departements dataset should not be empty.")

        return reg_dep_geoloc_df

    # we are forced to used scrapped this following a break in the BANATIC dataset.
    # see https://data-for-good.slack.com/archives/C08AW9JJ93P/p1739369130352499
    def _get_epci_coords(self) -> pd.DataFrame:
        """Return scrapped data for ECPI."""
        df = (
            pd.read_csv(
                Path(self._config["epci_coords_scrapped_data_file"]),
                sep=";",
                dtype={"siren": str},
            )
            .drop(columns=["nom"])
            .pipe(normalize_identifiant, id_col="siren", format=IdentifierFormat.SIREN)
        )
        if df.empty:
            raise Exception("EPCI coordinates file not found.")
        return df

    def _request_geolocator_api(self, payload: pd.DataFrame) -> pd.DataFrame:
        """Save payload to CSV to send to API, and return the response as dataframe"""
        payload_filename = self._config["temp_folder"]["filename"]
        payload_folder = get_project_base_path() / self._config["temp_folder"]["path"]
        payload_folder.mkdir(parents=True, exist_ok=True)
        payload_path = payload_folder / payload_filename
        payload.to_csv(payload_path, index=False)

        with open(payload_path, "rb") as payload_file:
            data = {
                "citycode": "code_insee",
                "result_columns": ["code_insee", "latitude", "longitude", "result_status"],
            }
            files = {"data": (payload_filename, payload_file, "text/csv")}

            response = requests.post(self._config["geolocator_api_url"], data=data, files=files)
            if response.status_code != 200:
                raise Exception(f"Failed to fetch data from geolocator API: {response.text}")

            df = pd.read_csv(io.StringIO(response.text))
            if df.empty:
                return df

            return (
                df.loc[df["result_status"] == "ok", ["code_insee", "latitude", "longitude"]]
                .astype({"code_insee": str})
                .assign(type="COM", code_insee=lambda df: df["code_insee"].str.zfill(5))
            )

    def add_geocoordinates(self, frame: pd.DataFrame) -> pd.DataFrame:
        """Function to add geocoordinates to a DataFrame containing regions, departments, EPCI, and communes.
        1. handle regions, departements and CTU from scrapped dataset
        2. handle ECPI from scrapped dataset
        3. handle cities by requesting the geolocator API
        4. merge results"""
        reg_dep_ctu = frame[frame["type"].isin(["REG", "DEP", "CTU"])].merge(
            self._get_reg_dep_coords(),
            on=["type", "code_insee"],
            how="left",
        )

        epci = frame[~frame["type"].isin(["REG", "DEP", "CTU", "COM"])].merge(
            self._get_epci_coords(),
            on=["type", "siren"],
            how="left",
        )

        cities = frame[frame["type"] == "COM"]
        print(cities)
        geolocator_response = self._request_geolocator_api(
            cities[["code_insee", "nom"]].drop_duplicates()
        )
        cities = cities.merge(geolocator_response, on=["type", "code_insee"], how="left")

        return pd.concat([reg_dep_ctu, epci, cities])
