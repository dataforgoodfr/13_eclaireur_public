import logging
from pathlib import Path

import pandas as pd

from back.scripts.datasets.dataset_aggregator import DatasetAggregator
from back.scripts.loaders import LOADER_CLASSES
from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.dataframe_operation import (
    IdentifierFormat,
    normalize_column_names,
    normalize_identifiant,
)
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)

COM_CSV_DTYPES = {
    "Code Siren Collectivité": str,
    "Code Insee Collectivité": str,
    "Code Insee 2023 Département": str,
    "Code Insee 2023 Région": str,
}
READ_COLUMNS = {
    "Exercice": None,
    "Outre-mer": None,
    "Catégorie": "categorie",
    "Population totale": "population",
    "Code Insee Collectivité": "code_insee",
    "Code Siren Collectivité": "siren",
    "Code Insee 2023 Département": "code_insee_dept",
    "Code Insee 2023 Région": "code_insee_region",
}


class OfglLoader(DatasetAggregator):
    """
    This dataset contains financial aggregation of frechn communities.
    Each type of communities has its own file and format.
    This dataset is mostly used later on to make the link between insee code and siren of the community.
    """

    INSEE_COL = {"DEP": "code_insee_dept", "REG": "code_insee_region", "COM": "code_insee"}

    @classmethod
    def get_config_key(cls):
        return "ofgl"

    @classmethod
    def from_config(cls, main_config):
        files = pd.read_csv(main_config[cls.get_config_key()]["urls_csv"], sep=";")
        return cls(files, main_config)

    def __init__(self, files: pd.DataFrame, main_config: dict):
        super().__init__(files, main_config)
        self.columns = pd.DataFrame()

    @tracker(ulogger=LOGGER, inputs=True)
    def _read_parse_file(self, file_metadata: tuple, raw_filename: Path) -> pd.DataFrame | None:
        # Because parquet format seems buggy on the platform for commune;
        # We are forced to use csv which need some typing help
        opts = {"columns": READ_COLUMNS.keys(), "dtype": COM_CSV_DTYPES}

        loader = LOADER_CLASSES[file_metadata.format](raw_filename, **opts)
        df = (
            loader.load()
            .rename(columns={k: v for k, v in READ_COLUMNS.items() if v})
            .pipe(normalize_column_names)
            .assign(
                type=file_metadata.code,
                outre_mer=lambda df: (df["outre_mer"] == "Oui").fillna(False),
            )
        )

        insee_col = self.INSEE_COL.get(file_metadata.code)
        if insee_col:
            df = df.assign(code_insee=lambda df: df[insee_col])

        df = (
            df.sort_values("exercice", ascending=False)
            .drop_duplicates(subset=["siren"], keep="first")
            .pipe(normalize_identifiant, id_col="siren", format=IdentifierFormat.SIREN)
        )

        self.columns = pd.concat(
            [self.columns, pd.DataFrame({file_metadata.code: 1}, index=df.columns)], axis=1
        )
        self.columns.to_csv(self.data_folder / "columns.csv")
        return df

    def get(self):
        data_file = self.data_folder / self._config["processed_data"]["filename"]

        # Load data from OFGL dataset if it was already processed
        if data_file.exists():
            self._logger.info("Found OFGL data on disk, loading it.")
            return pd.read_parquet(data_file)

        self._logger.info("Downloading and processing OFGL data.")
        # Load the mapping between EPCI and communes, downloaded from the OFGL website
        epci_communes_path = get_project_base_path() / self._config["epci"]["file"]
        epci_communes_mapping = pd.read_excel(
            epci_communes_path, dtype=self._config["epci"]["dtype"]
        )
        dataframes = []

        # Loop over the different collectivities type (regions, departements, communes, interco)
        for key, url in self._config["url"].items():
            # Download the data from the OFGL website
            df_loader = BaseLoader.loader_factory(url, dtype=self._config["dtype"])
            df = df_loader.load()
            # Process the data: keep only the relevant columns and rename them
            if key == "regions":
                df = self._process_regions(df)
            elif key == "departements":
                df = self._process_departements(df)
            elif key == "intercos":
                df = self._process_intercos(df)
            elif key == "communes":
                df = self._process_communes(df, epci_communes_mapping)
            else:
                raise ValueError("Unknown key", key)

            dataframes.append(df)

        data = (
            pd.concat(dataframes, axis=0, ignore_index=True)
            .astype({"SIREN": str})
            .assign(
                SIREN=lambda df: df["SIREN"].str.replace(".0", "").str.zfill(9),
                code_region=lambda df: df["code_region"]
                .astype(str)
                .where(df["code_region"].notna()),
            )
            .dropna(subset=["nom"])
            .pipe(normalize_column_names)
        )

        data.to_parquet(data_file, index=False)
        return data
