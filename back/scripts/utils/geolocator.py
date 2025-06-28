import logging
from io import StringIO
from pathlib import Path

import geopandas as gpd
import pandas as pd
import requests

from back.scripts.loaders import BaseLoader
from back.scripts.loaders.base_loader import retry_session
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
        self.data_folder = Path(self._config["data_folder"])

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

            df = pd.read_csv(StringIO(response.text))
            if df.empty:
                return df

            return (
                df.loc[df["result_status"] == "ok", ["code_insee", "latitude", "longitude"]]
                .astype({"code_insee": str})
                .assign(type="COM", code_insee=lambda df: df["code_insee"].str.zfill(5))
            )

    def get_request_file(self, url: str, filename: str):
        filepath = self.data_folder / filename
        if filepath.exists():
            return BaseLoader.loader_factory(filepath).load()

        filepath.parent.mkdir(exist_ok=True, parents=True)

        session = retry_session(retries=3)
        response = session.get(url)

        try:
            response.raise_for_status()
        except Exception as e:
            LOGGER.error(f"Failed to fetch data from geolocator API: {response.text}, {e}")
            return None

        return response

    def request_geo_type(self, admin_type: str) -> pd.DataFrame:
        # ok pour communes/epcis
        # pas de centre pour regions/departements
        filename = f"{admin_type}.csv"

        response = self.get_request_file(
            filename=filename,
            url=f"https://geo.api.gouv.fr/{admin_type}?fields=centre&geometry=centre",
        )
        if response is None:
            return pd.DataFrame()
        elif isinstance(response, pd.DataFrame):
            return response

        df = pd.read_json(StringIO(response.text))

        df[["longitude", "latitude"]] = pd.json_normalize(df["centre"])["coordinates"].tolist()
        if admin_type == "communes":
            df = df.rename(columns={"code": "code_insee"})
        elif admin_type == "epcis":
            df = df.rename(columns={"code": "siren"})
        df = df.drop(columns=["centre"])
        df.to_csv(self.data_folder / filename, index=False, encoding="utf-8", sep=";")
        return df

    def request_contour(self, admin_type: str) -> pd.DataFrame:
        # On a pas de données exploitables, le mieux c'est encore de les calculer à partir des contours
        # Les coordonnées ne sont pas très précises, cela permet de réduire la quantité de données
        # et actuellement, cela ne pose pas de problème car c'est uniquement pour un affichage sur la carte
        filename = f"{admin_type}.csv"
        response = self.get_request_file(
            filename=filename,
            url=f"https://object.data.gouv.fr/contours-administratifs/2025/geojson/{admin_type}-1000m.geojson",
        )
        if response is None:
            return pd.DataFrame()
        elif isinstance(response, pd.DataFrame):
            return response

        gdf = gpd.read_file(StringIO(response.text))

        gdf["centroid"] = gdf.geometry.to_crs("EPSG:3857").centroid.to_crs("EPSG:4326")
        gdf["longitude"] = gdf["centroid"].x
        gdf["latitude"] = gdf["centroid"].y

        gdf = gdf.drop(columns=["centroid", "geometry", "region"])
        gdf = gdf.rename(columns={"code": "code_insee"})

        gdf.to_csv(self.data_folder / filename, index=False, encoding="utf-8", sep=";")
        return pd.DataFrame(gdf)

    def add_geocoordinates(self, frame: pd.DataFrame) -> pd.DataFrame:
        """Function to add geocoordinates to a DataFrame containing regions, departments, EPCI, and communes.
        1. handle regions, departements and CTU from scrapped dataset
        2. handle ECPI from scrapped dataset
        3. handle cities by requesting the geolocator API
        4. merge results"""

        df_departements = frame[frame["type"] == "DEP"].merge(
            self.request_contour("departements").astype({"code_insee": str}),
            on=["code_insee"],
            how="left",
        )
        df_regions = frame[frame["type"].isin(["REG", "CTU"])].merge(
            self.request_contour("regions").astype({"code_insee": str}),
            on=["code_insee"],
            how="left",
        )

        df_cities = frame[frame["type"] == "COM"].merge(
            self.request_geo_type("communes"),
            on=["code_insee"],
            how="left",
        )

        df_epcis = frame[~frame["type"].isin(["REG", "DEP", "CTU", "COM"])].merge(
            self.request_geo_type("epcis").pipe(
                normalize_identifiant, id_col="siren", format=IdentifierFormat.SIREN
            ),
            on=["siren"],
            how="left",
        )

        return pd.concat([df_departements, df_regions, df_epcis, df_cities])
