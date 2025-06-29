import enum
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


class GeoTypeEnum(enum.StrEnum):
    REG = "regions"
    DEP = "departements"
    # CTU = "regions"
    COM = "communes"
    MET = "epcis"

    @property
    def code_name(self):
        return "siren" if self.name == "MET" else "code_insee"


class GeoLocator:
    """
    GeoLocator is a class that enriches a DataFrame containing regions, departments, EPCI, and communes with geocoordinates.
    It uses the code_insee (INSEE code) to retrieve the coordinates of the regions, departments, and communes from various sources: CSV & API.
    One external method is available to add geocoordinates to the DataFrame.
    """

    def __init__(self, config: dict):
        self.config = config
        self.data_folder = Path(self.config["data_folder"])

    def get_admin_type_filepath(self, admin_type: GeoTypeEnum) -> Path:
        return self.data_folder / f"{admin_type}.csv"

    def get_request_file(self, admin_type: GeoTypeEnum) -> Response | pd.DataFrame | None:
        filepath = self.get_admin_type_filepath(admin_type)
        if filepath.exists():
            return BaseLoader.loader_factory(filepath).load()

        filepath.parent.mkdir(exist_ok=True, parents=True)
        url = self.get_admin_type_url(admin_type)
        session = retry_session(retries=3)
        response = session.get(url)

        try:
            response.raise_for_status()
        except Exception as e:
            LOGGER.error(f"Failed to fetch data from geolocator API: {response.text}, {e}")
            return None

        return response

    def get_admin_type_url(self, admin_type: GeoTypeEnum) -> str:
        match admin_type:
            case GeoTypeEnum.COM | GeoTypeEnum.MET:
                return f"https://geo.api.gouv.fr/{admin_type}?fields=centre&geometry=centre"
            case GeoTypeEnum.REG | GeoTypeEnum.DEP:
                return f"https://object.data.gouv.fr/contours-administratifs/2025/geojson/{admin_type}-1000m.geojson"
            case _:
                raise ValueError(f"Unknown admin type: {admin_type}")

    def request_geo_type(self, admin_type: GeoTypeEnum) -> pd.DataFrame:
        # Va chercher les centroids des communes et epcis
        # cette information n'est pas disponible pour les regions et departements
        response = self.get_request_file(admin_type=admin_type)
        if isinstance(response, pd.DataFrame):
            return self.clean_df(response, admin_type=admin_type)

        if admin_type in (GeoTypeEnum.COM, GeoTypeEnum.MET):
            df = pd.read_json(StringIO(response.text))

            df[["longitude", "latitude"]] = pd.json_normalize(df["centre"])[
                "coordinates"
            ].tolist()
        else:
            gdf = gpd.read_file(StringIO(response.text))

            # Le changement de repère géospatial est conseillé pour améliorer la précision des résultats
            gdf["centroid"] = gdf.geometry.to_crs("EPSG:3857").centroid.to_crs("EPSG:4326")
            gdf["longitude"] = gdf["centroid"].x
            gdf["latitude"] = gdf["centroid"].y

            df = pd.DataFrame(gdf)

        df = df[["code", "nom", "longitude", "latitude"]]
        df = self.clean_df(df, admin_type=admin_type)
        self.export_df(df, admin_type=admin_type)
        return df

    def clean_df(self, df: pd.DataFrame, admin_type: GeoTypeEnum) -> pd.DataFrame:
        if admin_type == GeoTypeEnum.MET:
            df = df.rename(columns={"code": "siren"}).pipe(
                normalize_identifiant, id_col="siren", format=IdentifierFormat.SIREN
            )
        else:
            df = df.rename(columns={"code": "code_insee"}).astype({"code_insee": str})
        return df

    def export_df(self, df: pd.DataFrame, admin_type: GeoTypeEnum) -> None:
        df.to_csv(
            self.get_admin_type_filepath(admin_type), index=False, encoding="utf-8", sep=";"
        )

    def add_geocoordinates(self, frame: pd.DataFrame) -> pd.DataFrame:
        """Function to add geocoordinates to a DataFrame containing regions, departments, EPCI, and communes.
        1. handle regions, departements and CTU by querying the contours to calculate the centroid
        2. handle cities and ECPI by requesting the geolocator API
        3. concat results"""

        to_concat_dfs = list()
        for admin_type in GeoTypeEnum:
            df = frame[frame["type"] == admin_type.name].merge(
                self.request_geo_type(admin_type), on=[admin_type.code_name], how="left"
            )
            to_concat_dfs.append(df)

        df_concat = pd.concat(to_concat_dfs)
        df_concat["nom"] = df_concat["nom_y"].fillna(df_concat["nom_x"])
        df_concat = df_concat.drop(columns=["nom_x", "nom_y"])
        return df_concat
