import logging
from pathlib import Path

import pandas as pd

from back.scripts.communities.loaders.ofgl import OfglLoader
from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.utils.config import get_combined_filename, project_config
from back.scripts.utils.dataframe_operation import (
    IdentifierFormat,
    normalize_column_names,
    normalize_commune_code,
    normalize_identifiant,
)
from back.scripts.utils.datagouv_api import DataGouvAPI
from back.scripts.utils.decorators import tracker
from back.scripts.utils.geolocator import GeoLocator

LOGGER = logging.getLogger(__name__)


class CommunitiesSelector:
    """
    CommunitiesSelector manages and filters data from multiple loaders (OFGL, ODF, Sirene)
    to produce a curated list of French communities.
    It merges, cleans, and enriches datasets with geographic coordinates.
    """

    @classmethod
    def get_config_key(cls) -> str:
        return "communities"

    @classmethod
    def get_output_path(cls, main_config: dict) -> Path:
        return get_combined_filename(main_config, cls.get_config_key())

    def __init__(self, main_config):
        self.main_config = main_config
        self.config = main_config[self.get_config_key()]

        self.data_folder = Path(self.config["data_folder"])
        self.data_folder.mkdir(parents=True, exist_ok=True)

        self.output_filename = self.get_output_path(main_config)
        self.output_filename.parent.mkdir(parents=True, exist_ok=True)

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self):
        if self.output_filename.exists():
            return
        communities = (
            pd.read_parquet(OfglLoader.get_output_path(self.main_config))
            .drop_duplicates(subset=["siren"], keep="first")
            .drop(columns=["exercice"])
            .fillna({"population": 0})
            .pipe(self.add_collectivite_platforms)
            .pipe(self.add_epci_infos)
            .pipe(self.add_geocoordinates)
            .pipe(self.add_sirene_infos)
            .pipe(self.add_geo_and_postal_metrics)
            .pipe(normalize_column_names)
        )
        communities.to_parquet(self.output_filename, index=False)

    @tracker(ulogger=LOGGER, log_start=True)
    def add_collectivite_platforms(self, frame: pd.DataFrame) -> pd.DataFrame:
        """
        ODF dataset comes from a 2019 study about how collectivities contributed to the open data movement.
        It is not updated since then and is not representative of the current landscape.
        As a result, it is directly integrated as a CSV in the project to allow updates when needed.
        URL : https://static.data.gouv.fr/resources/donnees-de-lobservatoire-open-data-des-territoires-edition-2022/20230202-112356/indicateurs-odater-organisations-2022-12-31-.csv
        """
        odf = BaseLoader.loader_factory(self.config["odf_url"]).load()
        return frame.merge(odf, on="siren", how="left")

    @tracker(ulogger=LOGGER, log_start=True)
    def add_sirene_infos(self, frame: pd.DataFrame) -> pd.DataFrame:
        sirene = pd.read_parquet(
            project_config["sirene"]["combined_filename"],
            columns=["siren", "naf8", "tranche_effectif", "raison_sociale", "is_active"],
        ).pipe(lambda df: df[df["naf8"].isin(["8411Z", "8710C", "3700Z", "8413Z"])])

        return (
            frame.merge(sirene, on="siren", how="left")
            .pipe(lambda df: df[df["is_active"].fillna(True)])
            .fillna({"tranche_effectif": 0})
            .assign(
                effectifs_sup_50=lambda df: df["tranche_effectif"] >= 50,
                nom=lambda df: df["raison_sociale"].fillna(df["nom"]),
            )
            .assign(
                should_publish=lambda df: (df["type"] != "COM")
                | ((df["type"] == "COM") & (df["population"] >= 3500) & df["effectifs_sup_50"])
            )
            .drop(columns=["raison_sociale", "is_active"])
            .merge(
                sirene[["siren", "raison_sociale"]].rename(columns={"siren": "siren_epci"}),
                on="siren_epci",
                how="left",
            )
            .rename(columns={"raison_sociale": "nom_epci"})
        )

    @tracker(ulogger=LOGGER, log_start=True)
    def add_geo_and_postal_metrics(self, frame: pd.DataFrame) -> pd.DataFrame:
        """
        Adds area (superficie), density and postal code to the communities DataFrame by fetching
        the latest version from data.gouv.fr using the dataset_id.
        """
        geo_metrics_filename = self.data_folder / "geo_metrics.parquet"
        if geo_metrics_filename.exists():
            LOGGER.info("Loading geometrics dataset from local cache")
            geo_metrics_df = pd.read_parquet(geo_metrics_filename)
            return frame.merge(geo_metrics_df, on="code_insee", how="left")

        dataset_id = self.config["geo_metrics_dataset_id"]

        resources_df = DataGouvAPI.dataset_resources(dataset_id)
        if resources_df.empty:
            raise ValueError(f"No resources found for dataset ID {dataset_id}")

        resource_url = resources_df.loc[
            resources_df["format"].str.lower() == "csv", "resource_url"
        ].iloc[0]

        geo_metrics_df = (
            BaseLoader.loader_factory(
                resource_url,
                dtype={"code_insee": str},
                columns=["code_insee", "superficie_km2", "code_postal"],
            )
            .load()
            .pipe(normalize_commune_code, id_col="code_insee")
            .pipe(normalize_commune_code, id_col="code_postal")
            .drop_duplicates(subset=["code_insee"])
        )

        LOGGER.info("Saving geometrics dataset to local cache")
        geo_metrics_df.to_parquet(geo_metrics_filename)

        return frame.merge(geo_metrics_df, on="code_insee", how="left").assign(
            densite=lambda df: df["population"].div(df["superficie_km2"])
        )

    def add_epci_infos(self, frame: pd.DataFrame) -> pd.DataFrame:
        epci_mapping = (
            BaseLoader.loader_factory(
                self.config["epci_url"], columns=["siren", "siren_membre"]
            )
            .load()
            .rename(columns={"siren": "siren_epci", "siren_membre": "siren"})
            .pipe(normalize_identifiant, id_col="siren_epci", format=IdentifierFormat.SIREN)
            .pipe(normalize_identifiant, id_col="siren", format=IdentifierFormat.SIREN)
        )
        return frame.merge(epci_mapping, on="siren", how="left")

    def add_geocoordinates(self, frame: pd.DataFrame) -> pd.DataFrame:
        geolocator = GeoLocator(self.config["geolocator"])

        return geolocator.add_geocoordinates(frame)
