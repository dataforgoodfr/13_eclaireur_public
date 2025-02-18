import io
import logging
import requests
from pathlib import Path
import pandas as pd

from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.df_types import (
    BaseCommunitiesNoCoordsDf,
    BaseCommunitiesWithCoordsDf,
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

    Parameters
    ----------
    geo_config: dict
        The config used to parametrize the GeoLocator instance.

    Attributes
    ----------
    _config: dict
        The config used to parametrize the GeoLocator instance.
    logger: logging.Logger
        The logger.
    """

    def __init__(self, geo_config: dict) -> None:
        self.logger = logging.getLogger(__name__)
        self._config = geo_config

    @staticmethod
    def _get_reg_dep_coords() -> RegionDepartmentCoordsDf:
        """Reads the regions and departments coordinates dataframe from its source file.

        Returns
        -------
        df_reg_dep_geoloc: RegionDepartmentCoordsDf
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
        df_reg_dep_geoloc = pd.read_csv(
            data_folder / reg_dep_geoloc_filename, sep=";"
        )  # TODO: Use CSVLoader
        if df_reg_dep_geoloc.empty:
            raise FileNotFoundError("Regions and departements coordinates file not found.")

        df_reg_dep_geoloc["cog"] = df_reg_dep_geoloc["cog"].astype(str)
        df_reg_dep_geoloc = df_reg_dep_geoloc.drop(columns=["nom"])
        return df_reg_dep_geoloc

    # we are forced to used scrapped this following a break in the BANATIC dataset.
    # see https://data-for-good.slack.com/archives/C08AW9JJ93P/p1739369130352499
    def _get_epci_coords(self) -> EPCICoordsDf:
        """Reads the EPCI coordinates dataframe from its source file.

        Returns
        -------
        df_epci: EPCICoordsDf
            The dataframe storing the EPCI coordinates.

        Raises
        ------
        FileNotFoundError: when the EPCI dataset source file is not found.
        """

        df_epci = pd.read_csv(Path(self._config["epci_coords_scrapped_data_file"]), sep=";")
        if df_epci.empty:
            raise FileNotFoundError("EPCI coordinates file not found.")

        df_epci = df_epci.drop(columns=["nom"])
        df_epci = df_epci.astype({"latitude": str, "longitude": str})

        return df_epci

    def _request_geolocator_api(
        self, df_cog: BaseCommunitiesNoCoordsDf
    ) -> BaseCommunitiesWithCoordsDf:
        """Save df_cog to CSV to send to API, and return the response as a dataframe with coordinates.

        Parameters
        ----------
        df_cog: BaseCommunitiesNoCoordsDf
            The COG dataframe with not coordinates.
        Returns
        -------
        df_cog_geoloc: BaseCommunitiesWithCoordsDf
            The COG dataframe with coordinates.
        """

        folder = get_project_base_path() / self._config["processed_data_folder"]
        df_cog_filename = "cities_to_geolocate.csv"
        df_cog_path = folder / df_cog_filename
        df_cog.to_csv(df_cog_path, sep=";", index=False)

        with df_cog_path.open("rb") as df_cog_file:
            data = {
                "citycode": "cog",
                "result_columns": ["cog", "latitude", "longitude", "result_status"],
            }
            files = {"data": (df_cog_filename, df_cog_file, "text/csv")}

            response = requests.post(self._config["geolocator_api_url"], data=data, files=files)
            if response.status_code != 200:
                raise Exception(f"Failed to fetch data from geolocator API: {response.text}")

            df_cog_geoloc = pd.read_csv(io.StringIO(response.text), sep=";")
            df_cog_geoloc = df_cog_geoloc[df_cog_geoloc["result_status"] == "ok"]
            df_cog_geoloc = df_cog_geoloc[["cog", "latitude", "longitude"]]
            df_cog_geoloc.loc[:, "type"] = "COM"
            df_cog_geoloc = df_cog_geoloc.astype(
                {"cog": str, "latitude": str, "longitude": str}
            )
            df_cog_geoloc["cog"] = df_cog_geoloc["cog"].str.zfill(5)

            return df_cog_geoloc

    def add_geocoordinates(self, df: CommunitiesNocoordsDf) -> CommunitiesWithcoordsDf:
        """Function to add geocoordinates to a DataFrame containing regions, departments, EPCI, and communes.

        1. handle regions, departements and CTU from scrapped dataset
        2. handle ECPI from scrapped dataset
        3. handle cities by requesting the geolocator API
        4. merge results

        Parameters
        ----------
        df: CommunitiesNocoordsDf
            The dataframe of geographic entities without coordinates.

        Returns
        -------
        df_with_coords: CommunitiesWithcoordsDf
            The dataframe of geographic entities with coordinates.
        """

        reg_dep_ctu = df[df["type"].isin(["REG", "DEP", "CTU"])].merge(
            self._get_reg_dep_coords(),
            on=["type", "cog"],
            how="left",
        )

        epci = df[~df["type"].isin(["REG", "DEP", "CTU", "COM"])].merge(
            self._get_epci_coords(),
            on=["type", "siren"],
            how="left",
        )

        cities = df[df["type"] == "COM"]
        geolocator_response = self._request_geolocator_api(
            cities[["cog", "nom"]].drop_duplicates()
        )
        cities = cities.merge(geolocator_response, on=["type", "cog"], how="left")

        df_with_coords = pd.concat([reg_dep_ctu, epci, cities])
        return df_with_coords
