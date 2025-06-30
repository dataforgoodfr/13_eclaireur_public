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
    def code_name(self) -> str:
        # nom de la colonne 'code' sur laquelle on fait le merge
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

    def get_output_filename(self, geo_type: GeoTypeEnum) -> Path:
        """
        Returns the output file for a given geo_type.
        """
        return self.data_folder / f"{geo_type}.csv"

    def get_request_file(self, geo_type: GeoTypeEnum) -> Response | pd.DataFrame | None:
        """
        Returns the request file for a given geo_type.
        Try 3 times to get the file.
        Returns:
            None: if the request failed or the file cannot be read
            pd.DataFrame: if the file is already downloaded
            Response: if the file is not downloaded and the request is successful
        """
        filepath = self.get_output_filename(geo_type)
        if filepath.exists():
            return BaseLoader.loader_factory(filepath).load()

        filepath.parent.mkdir(exist_ok=True, parents=True)
        url = self.get_geo_type_url(geo_type)
        session = retry_session(retries=3)
        response = session.get(url)

        try:
            response.raise_for_status()
        except Exception as e:
            LOGGER.error(f"Failed to fetch data from geolocator API: {response.text}, {e}")
            return None

        return response

    def get_geo_type_url(self, geo_type: GeoTypeEnum) -> str:
        """
        Returns the API url for a given geo_type.
        Raise ValueError if the geo_type is unknown
        """
        match geo_type:
            case GeoTypeEnum.COM | GeoTypeEnum.MET:
                return f"https://geo.api.gouv.fr/{geo_type}?fields=centre&geometry=centre"
            case GeoTypeEnum.REG | GeoTypeEnum.DEP:
                return f"https://object.data.gouv.fr/contours-administratifs/2025/geojson/{geo_type}-1000m.geojson"
            case _:
                raise ValueError(f"Unknown admin type: {geo_type}")

    def request_geo_type(self, geo_type: GeoTypeEnum) -> pd.DataFrame:
        """
        Returns a DataFrame containing the centroid geocoordinates for a given geo_type.
        Centroid is stored in columns longitude and latitude
        """
        response = self.get_request_file(geo_type=geo_type)
        if response is None:
            return pd.DataFrame()
        elif isinstance(response, pd.DataFrame):
            return self.clean_df(response, geo_type=geo_type)

        if geo_type in (GeoTypeEnum.COM, GeoTypeEnum.MET):
            # Pour ces types, la donnée officielle est accessible
            df = pd.read_json(StringIO(response.text))

            df[["longitude", "latitude"]] = pd.json_normalize(df["centre"])[
                "coordinates"
            ].tolist()
        else:
            # Pour les autres types, on calcule les centroids à partir des contours de la zone
            gdf = gpd.read_file(StringIO(response.text))

            # Le changement de repère géospatial est conseillé pour améliorer la précision des résultats
            gdf["centroid"] = gdf.geometry.to_crs("EPSG:3857").centroid.to_crs("EPSG:4326")
            gdf["longitude"] = gdf["centroid"].x
            gdf["latitude"] = gdf["centroid"].y

            df = pd.DataFrame(gdf)

        df = df[["code", "nom", "longitude", "latitude"]]
        df = df.rename(columns={"code": geo_type.code_name})
        df = self.clean_df(df, geo_type=geo_type)
        self.export_df(df, geo_type=geo_type)
        return df

    def clean_df(self, df: pd.DataFrame, geo_type: GeoTypeEnum) -> pd.DataFrame:
        """
        Clean the DataFrame
        """
        df = df.astype({geo_type.code_name: str})
        if "siren" in df.columns:
            df = df.pipe(normalize_identifiant, id_col="siren", format=IdentifierFormat.SIREN)
        return df

    def export_df(self, df: pd.DataFrame, geo_type: GeoTypeEnum) -> None:
        """
        Export the DataFrame to a CSV file
        """
        df.to_csv(self.get_output_filename(geo_type), index=False, encoding="utf-8", sep=";")

    def add_geocoordinates(self, frame: pd.DataFrame) -> pd.DataFrame:
        """Function to add geocoordinates to a DataFrame containing regions, departments, EPCI, and communes.
        1. handle regions, departements and CTU by querying the contours to calculate the centroid
        2. handle cities and ECPI by requesting the geolocator API
        3. concat results"""

        # check type
        geo_diff = set(frame["type"]) - GeoTypeEnum._member_map_.keys()
        if geo_diff:
            LOGGER.warning(f"Unknown geo types: {';'.join(geo_diff)}")

        to_concat_dfs = list()
        for geo_type in GeoTypeEnum:
            df = frame[frame["type"] == geo_type.name].merge(
                self.request_geo_type(geo_type), on=[geo_type.code_name], how="left"
            )
            to_concat_dfs.append(df)

        df_concat = pd.concat(to_concat_dfs)
        df_concat["nom"] = df_concat["nom_y"].fillna(df_concat["nom_x"])
        df_concat = df_concat.drop(columns=["nom_x", "nom_y"])
        return df_concat
