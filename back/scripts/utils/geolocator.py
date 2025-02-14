import io
import logging
import requests
from pathlib import Path
import pandas as pd

from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.df_types import (
    CommunitiesNocoordsDf,
    CommunitiesWithcoordsDf,
    EPCICoordsDf,
    RegionDepartmentCoordsDf,
)


class GeoLocator:
    """
    GeoLocator is a class that enriches a DataFrame containing regions, departments, EPCI, and communes with geocoordinates.
    It uses the COG (INSEE code) to retrieve the coordinates of the regions, departments, and communes from various sources: CSV & API.
    One external method is available to add geocoordinates to the DataFrame.
    """

    def __init__(self, geo_config: dict) -> None:
        self.logger = logging.getLogger(__name__)
        self._config = geo_config

    # return scrapped data for regions and departements
    @staticmethod
    def _get_reg_dep_coords() -> RegionDepartmentCoordsDf:
        """Reads the regions and departments coordinates dataframe from its source file.

        Returns
        -------
        reg_dep_geoloc_df: RegionDepartmentCoordsDf
            The dataframe containing the region and departments coordinates.

        Raises
        ------
        FileNotFoundError: when the regions and departments dataset source file is not found.
        """

        data_folder = (
            get_project_base_path()
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
            raise FileNotFoundError("Regions and departements coordinates file not found.")

        reg_dep_geoloc_df["cog"] = reg_dep_geoloc_df["cog"].astype(str)
        return reg_dep_geoloc_df.drop(columns=["nom"])

    # we are forced to used scrapped this following a break in the BANATIC dataset.
    # see https://data-for-good.slack.com/archives/C08AW9JJ93P/p1739369130352499
    def _get_epci_coords(self) -> EPCICoordsDf:
        """Reads the EPCI coordinates dataframe from its source file.

        Returns
        -------
        df: EPCICoordsDf
            The dataframe storing the EPCI coordinates.

        Raises
        ------
        FileNotFoundError: when the EPCI dataset source file is not found.
        """

        df = pd.read_csv(Path(self._config["epci_coords_scrapped_data_file"]), sep=";")
        if df.empty:
            raise FileNotFoundError("EPCI coordinates file not found.")

        df = df.drop(columns=["nom"])
        df = df.astype({"latitude": str, "longitude": str})
        return df

    def _request_geolocator_api(self, payload) -> pd.DataFrame:
        """Save payload to CSV to send to API, and return the response as dataframe"""
        folder = get_project_base_path() / self._config["processed_data_folder"]
        payload_filename = "cities_to_geolocate.csv"
        payload_path = folder / payload_filename
        payload.to_csv(payload_path, sep=";", index=False)

        with payload_path.open("rb") as payload_file:
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

            self.logger.warning(f"geolocator_api_df:\n{df.dtypes}\n{df.iloc[0]}")

            return df

    # Function to add geocoordinates to a DataFrame containing regions, departments, EPCI, and communes
    # 1. handle regions, departements and CTU from scrapped dataset
    # 2. handle ECPI from scrapped dataset
    # 3. handle cities by requesting the geolocator API
    # 4. merge results
    def add_geocoordinates(self, df: CommunitiesNocoordsDf) -> CommunitiesWithcoordsDf:
        # 1. handle REG, DEP, CTU
        reg_dep_ctu = df.loc[df["type"].isin(["REG", "DEP", "CTU"])]
        reg_dep_ctu = reg_dep_ctu.merge(
            self._get_reg_dep_coords(),
            on=["type", "cog"],
            how="left",
        )

        epci = df[~df["type"].isin(["REG", "DEP", "CTU", "COM"])].merge(
            self._get_epci_coords(),
            on=["type", "siren"],
            how="left",
        )

        cities = df.loc[df["type"] == "COM"]
        geolocator_response = self._request_geolocator_api(
            cities[["cog", "nom"]].drop_duplicates()
        )
        cities = cities.merge(geolocator_response, on=["type", "cog"], how="left")

        return pd.concat([reg_dep_ctu, epci, cities])
