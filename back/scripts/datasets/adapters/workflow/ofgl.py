import logging
from pathlib import Path

import pandas as pd
import polars as pl
from tqdm import tqdm

from back.scripts.datasets.adapters.http_downloader import HttpFileDownloader
from back.scripts.datasets.adapters.url_data_source import UrlDataSource
from back.scripts.datasets.entities import FileMetadata
from back.scripts.datasets.interfaces.data_source import IDataSource
from back.scripts.datasets.interfaces.file_downloader import IFileDownloader
from back.scripts.datasets.interfaces.file_parser import IFileParser
from back.scripts.interfaces.workflow import IWorkflow, IWorkflowFactory
from back.scripts.loaders import BaseLoader
from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.dataframe_operation import (
    IdentifierFormat,
    normalize_column_names,
    normalize_identifiant,
)

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
INSEE_COL_MAPPING = {"DEP": "code_insee_dept", "REG": "code_insee_region", "COM": "code_insee"}


class OfglFileParser(IFileParser):
    """
    Parses a single raw OFGL data file.
    """

    def parse(self, file_metadata: FileMetadata, raw_filename: Path) -> pd.DataFrame | None:
        """
        Reads and parses a raw OFGL data file, applying the specific OFGL normalization logic.
        """
        opts = {
            "columns": READ_COLUMNS.keys(),
            "dtype": COM_CSV_DTYPES,
            "chunksize": 1000,
        }
        loader = BaseLoader.loader_factory(raw_filename, **opts)

        df = (
            loader.load()
            .rename(columns={k: v for k, v in READ_COLUMNS.items() if v})
            .pipe(normalize_column_names)
            .assign(
                type=file_metadata.extra_data.get("code"),
                outre_mer=lambda df: (df["outre_mer"] == "Oui").fillna(False),
            )
        )

        insee_col_key = file_metadata.extra_data.get("code")
        insee_col = INSEE_COL_MAPPING.get(insee_col_key)
        if insee_col:
            df = df.assign(code_insee=lambda df: df[insee_col])

        return (
            df.sort_values("exercice", ascending=False)
            .drop_duplicates(subset=["siren"], keep="first")
            .pipe(normalize_identifiant, id_col="siren", format=IdentifierFormat.SIREN)
        )


class OfglWorkflow(IWorkflow):
    """
    Orchestrates the OFGL data processing workflow:
    1. Gets file metadata from a data source.
    2. Downloads each file.
    3. Parses each downloaded file.
    4. Concatenates the results into a single Parquet file.
    """

    def __init__(
        self,
        data_source: IDataSource,
        downloader: IFileDownloader,
        parser: IFileParser,
        output_path: Path,
        data_folder: Path,
    ):
        self.data_source = data_source
        self.downloader = downloader
        self.parser = parser
        self.output_path = output_path
        self.data_folder = data_folder

    def get_output_path(self) -> Path:
        return self.output_path

    def _get_norm_path(self, file_metadata: FileMetadata) -> Path:
        """Determines the local path for the normalized parquet file."""
        return self.data_folder / file_metadata.url_hash / "norm.parquet"

    def run(self) -> None:
        if self.output_path.exists():
            LOGGER.info(f"OFGL dataset already exists at {self.output_path}, skipping.")
            return

        all_files = self.data_source.get_files()
        for file_meta in tqdm(all_files, desc="Processing OFGL files"):
            norm_path = self._get_norm_path(file_meta)
            if norm_path.exists():
                continue

            raw_path = self.downloader.download(file_meta)
            if not raw_path:
                continue

            parsed_df = self.parser.parse(file_meta, raw_path)
            if parsed_df is not None:
                norm_path.parent.mkdir(exist_ok=True, parents=True)
                parsed_df.to_parquet(norm_path, index=False)

        self._concatenate_files()

    def _concatenate_files(self):
        """Concatenates all normalized parquet files into a single output file."""
        all_norm_files = list(self.data_folder.glob("*/norm.parquet"))
        if not all_norm_files:
            LOGGER.warning("No normalized files found to concatenate for OFGL.")
            return

        LOGGER.info(f"Concatenating {len(all_norm_files)} OFGL files...")
        dfs = [pl.scan_parquet(f) for f in all_norm_files]
        df = pl.concat(dfs, how="diagonal_relaxed")
        df.sink_parquet(self.output_path)
        LOGGER.info(f"OFGL dataset created at {self.output_path}")


class OfglWorkflowFactory(IWorkflowFactory):
    """Factory to create the OfglWorkflow from configuration."""

    @classmethod
    def from_config(cls, main_config: dict) -> IWorkflow:
        config_key = "ofgl"
        ofgl_config = main_config[config_key]

        base_path = get_project_base_path()
        urls_csv_path = base_path / ofgl_config["urls_csv"]
        data_folder = base_path / ofgl_config["data_folder"]
        output_path = base_path / ofgl_config["combined_filename"]

        data_source = UrlDataSource(urls_csv_path)
        downloader = HttpFileDownloader(data_folder)
        parser = OfglFileParser()

        return OfglWorkflow(
            data_source=data_source,
            downloader=downloader,
            parser=parser,
            output_path=output_path,
            data_folder=data_folder,
        )
