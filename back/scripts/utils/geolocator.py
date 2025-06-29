import logging
from io import StringIO
from pathlib import Path

import geopandas as gpd
import pandas as pd
from requests import Response

from back.scripts.loaders import BaseLoader
from back.scripts.loaders.base_loader import retry_session
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

    def get_request_file(self, url: str, filename: str) -> Response | pd.DataFrame | None:
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
        # Va chercher les centroids des communes et epcis
        # cette information n'est pas disponible pour les regions et departements
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
        df = df[["code", "nom", "longitude", "latitude"]]
        if admin_type == "communes":
            df = df.rename(columns={"code": "code_insee"})
        elif admin_type == "epcis":
            df = df.rename(columns={"code": "siren"})
        df.to_csv(self.data_folder / filename, index=False, encoding="utf-8", sep=";")
        return df

    def request_contour(self, admin_type: str) -> pd.DataFrame:
        # On a pas de données exploitables, le mieux c'est encore de les calculer à partir des contours
        # Les coordonnées ne sont pas très précises, cela permet de réduire la quantité de données
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

        # Le changement de repère géospatial est conseillé pour améliorer la précision des résultats
        gdf["centroid"] = gdf.geometry.to_crs("EPSG:3857").centroid.to_crs("EPSG:4326")
        gdf["longitude"] = gdf["centroid"].x
        gdf["latitude"] = gdf["centroid"].y

        gdf = gdf[["code", "nom", "longitude", "latitude"]]
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
