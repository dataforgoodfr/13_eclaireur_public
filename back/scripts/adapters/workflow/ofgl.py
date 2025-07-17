import logging
from pathlib import Path

import polars as pl
from tqdm import tqdm

from back.scripts.adapters.http_downloader import HttpFileDownloader
from back.scripts.adapters.url_data_source import UrlDataSource
from back.scripts.datasets.entities import FileMetadata
from back.scripts.entities.ofgl import (
    OfglCommuneRecordDataframe,
    OfglDepartementRegionGfpRecordDataframe,
)
from back.scripts.interfaces.data_source import IDataSource
from back.scripts.interfaces.file_downloader import IFileDownloader
from back.scripts.interfaces.file_parser import IFileParser
from back.scripts.interfaces.workflow import IWorkflow, IWorkflowFactory
from back.scripts.loaders import BaseLoader
from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.dataframe_operation import IdentifierFormat
from back.scripts.utils.polars_operation import (
    normalize_column_names_pl,
    normalize_identifiant_pl,
)

LOGGER = logging.getLogger(__name__)

COM_CSV_DTYPES = {
    "Code Siren Collectivité": pl.Utf8,
    "Code Insee Collectivité": pl.Utf8,
    "Code Insee 2023 Département": pl.Utf8,
    "Code Insee 2023 Région": pl.Utf8,
}
READ_COLUMNS = {
    "Exercice": None,
    "Outre-mer": None,
    "Catégorie": "categorie",
    "Population totale": "population",
    "Code Insee Collectivité": "code_insee",
    "Code Siren Collectivité": "siren",
    "Code Insee 2023 Département": "code_insee_dept",
    "Code Insee 2024 Département": "code_insee_dept",
    "Code Insee 2023 Région": "code_insee_region",
    "Code Insee 2024 Région": "code_insee_region",
}
INSEE_COL_MAPPING = {"DEP": "code_insee_dept", "REG": "code_insee_region", "COM": "code_insee"}

SCHEMA_MAPPING = {
    "DEP": OfglDepartementRegionGfpRecordDataframe,
    "MET": OfglCommuneRecordDataframe,
    "REG": OfglCommuneRecordDataframe,
    "COM": OfglCommuneRecordDataframe,
}


class OfglFileParser(IFileParser[pl.LazyFrame]):
    """
    Parses a single raw OFGL data file using Polars.
    """

    def parse(self, file_metadata: FileMetadata, raw_filename: Path) -> pl.LazyFrame | None:
        """
        Reads and parses a raw OFGL data file, applying the specific OFGL normalization logic.
        """
        opts = {
            # "with_column_names": list(READ_COLUMNS.keys()),
            "schema_overrides": COM_CSV_DTYPES,
            "separator": ";",
        }
        loader = BaseLoader.loader_factory(raw_filename, **opts)
        df_lazy = loader.load_lazy()
        validation_df = SCHEMA_MAPPING.get(file_metadata.extra_data.get("code")).validate(
            df_lazy
        )
        val_path = raw_filename.parent / "validation.parquet"
        validation_df.sink_parquet(val_path, lazy=True)
        df_lazy = (
            df_lazy.rename({k: v for k, v in READ_COLUMNS.items() if v}, strict=False)
            .pipe(normalize_column_names_pl)
            .with_columns(
                pl.lit(file_metadata.extra_data.get("code")).alias("type"),
                pl.col("outre_mer")
                .str.to_lowercase()
                .eq("oui")
                .fill_null(False)
                .alias("outre_mer"),
            )
        )

        insee_col_key = file_metadata.extra_data.get("code")
        insee_col = INSEE_COL_MAPPING.get(insee_col_key)
        if insee_col and insee_col in df_lazy.columns:
            df_lazy = df_lazy.with_columns(pl.col(insee_col).alias("code_insee"))

        return (
            df_lazy.sort("exercice", descending=True)
            .unique(subset=["siren"], keep="first")
            .pipe(normalize_identifiant_pl, id_col="siren", format=IdentifierFormat.SIREN)
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

    def _get_validation_path(self, file_metadata: FileMetadata) -> Path:
        """Determines the local path for the validation parquet file."""
        return self.data_folder / file_metadata.url_hash / "validation.parquet"

    def run(self) -> None:
        if self.output_path.exists():
            LOGGER.info(f"OFGL dataset already exists at {self.output_path}, skipping.")
            return

        all_files = self.data_source.get_files()
        for file_meta in tqdm(all_files, desc="Processing OFGL files"):
            norm_path = self._get_norm_path(file_meta)
            val_path = self._get_validation_path(file_meta)
            if norm_path.exists():
                continue

            raw_path = self.downloader.download(file_meta)
            if not raw_path:
                continue

            parsed_lazy_df = self.parser.parse(file_meta, raw_path)
            if parsed_lazy_df is not None:
                norm_path.parent.mkdir(exist_ok=True, parents=True)
                # Use sink_parquet for lazy frames
                parsed_lazy_df.sink_parquet(norm_path)

        self._concatenate_files()

    def _concatenate_files(self):
        """Concatenates all normalized parquet files into a single output file."""
        all_norm_files = list(self.data_folder.glob("*/norm.parquet"))
        if not all_norm_files:
            LOGGER.warning("No normalized files found to concatenate for OFGL.")
            return

        LOGGER.info(f"Concatenating {len(all_norm_files)} OFGL files...")
        # The rest of the concatenation logic remains the same as it already uses Polars
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
