import logging
from pathlib import Path

import pandas as pd

from back.scripts.datasets.dataset_aggregator import DatasetAggregator
from back.scripts.loaders import LOADER_CLASSES
from back.scripts.loaders.base_loader import BaseLoader
from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.dataframe_operation import normalize_column_names
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)

COM_CSV_DTYPES = {"Code Siren 2023 EPCI": str, "Code Siren Collectivité": str}


class OfglLoader(DatasetAggregator):
    @classmethod
    def from_config(cls, config):
        files = pd.read_csv(config["urls_csv"], sep=";")
        return cls(files, config)

    @tracker(ulogger=LOGGER, inputs=True)
    def _read_parse_file(self, file_metadata: tuple, raw_filename: Path) -> pd.DataFrame | None:
        # Because parquet format seems buggy on the platform for commune;
        # We are forced to use csv which need some typing help
        opts = {"dtype": COM_CSV_DTYPES} if file_metadata.format == "csv" else {}
        loader = LOADER_CLASSES[file_metadata.format](raw_filename, **opts)
        df = (
            loader.load()
            .pipe(normalize_column_names)
            .assign(
                type=file_metadata.code,
                outre_mer=lambda df: (df["outre_mer"] == "Oui").fillna(False),
            )
        )
        if "reg_is_ctu" in df.columns:
            df = df.assign(reg_is_ctu=(df["reg_is_ctu"] == "Oui").fillna(False))

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
