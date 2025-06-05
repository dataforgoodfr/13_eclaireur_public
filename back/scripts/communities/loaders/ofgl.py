import logging
from pathlib import Path

import pandas as pd

from back.scripts.datasets.dataset_aggregator import DatasetAggregator
from back.scripts.loaders import LOADER_CLASSES
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
    def _read_parse_file(
        self, file_metadata: pd.DataFrame, raw_filename: Path
    ) -> pd.DataFrame | None:
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
