import logging
from pathlib import Path

import pandera.polars as pa
import polars as pl
from tqdm import tqdm

from back.scripts.adapters.http_downloader import HttpFileDownloader
from back.scripts.adapters.url_data_source import UrlDataSource
from back.scripts.datasets.entities import FileMetadata
from back.scripts.entities.ofgl import Ofgl2024RecordDataframe
from back.scripts.interfaces.data_source import IDataSource
from back.scripts.interfaces.file_downloader import IFileDownloader
from back.scripts.interfaces.file_parser import IFileParser
from back.scripts.interfaces.workflow import IWorkflow, IWorkflowFactory
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
    "Code Insee 2024 Département": pl.Utf8,
    "Code Insee 2024 Région": pl.Utf8,
}
READ_COLUMNS = {
    "Exercice": None,
    "Outre-mer": None,
    "Catégorie": "categorie",
    "Population totale": "population",
    "Code Insee Collectivité": "code_insee",
    "Code Siren Collectivité": "siren",
    "Code Insee 2024 Département": "code_insee_dept",
    "Code Insee 2024 Région": "code_insee_region",
}
INSEE_COL_MAPPING = {"DEP": "code_insee_dept", "REG": "code_insee_region", "COM": "code_insee"}


class OfglFileParser(IFileParser[pl.LazyFrame]):
    """
    Parses a single raw OFGL data file using Polars.
    """

    def parse(self, file_metadata: FileMetadata, raw_filename: Path) -> pl.LazyFrame | None:
        """
        Reads and parses a raw OFGL data file, applying the specific OFGL normalization logic.
        """
        df_lazy = pl.scan_csv(raw_filename, separator=";", schema_overrides=COM_CSV_DTYPES)
        try:
            # Trigger validation on a separate frame to catch errors without
            # altering the main lazy frame.
            validated_df = Ofgl2024RecordDataframe.validate(df_lazy.collect(), lazy=True)
        except pa.errors.SchemaErrors as e:
            val_path = raw_filename.parent / "validation.parquet"
            LOGGER.error(f"OFGL data validation failed, saving errors to {val_path}")
            e.failure_cases.lazy().sink_parquet(val_path)
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

        insee_col_key = file_metadata.extra_data.get("code", "")
        insee_col = INSEE_COL_MAPPING.get(str(insee_col_key))
        if insee_col and insee_col in df_lazy.collect_schema().names():
            df_lazy = df_lazy.with_columns(pl.col(insee_col).alias("code_insee"))

        df_lazy = (
            df_lazy.sort("exercice", descending=True)
            .unique(subset=["siren"], keep="first")
            .pipe(normalize_identifiant_pl, id_col="siren", format=IdentifierFormat.SIREN)
        )
        return df_lazy


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

            raw_path = None
            if file_meta.url.startswith("file:"):
                # It's a local file, extract the path
                local_path_str = file_meta.url[len("file:") :]
                raw_path = Path(local_path_str)
                if not raw_path.exists():
                    LOGGER.warning(f"Local file not found: {raw_path}")
                    raw_path = None
            elif file_meta.url.startswith("http://") or file_meta.url.startswith("https://"):
                # It's a remote file, download it
                raw_path = self.downloader.download(file_meta)
            else:
                # Assume it's a local path without a scheme
                raw_path = Path(file_meta.url)
                if not raw_path.exists():
                    LOGGER.warning(f"Local file not found: {raw_path}")
                    raw_path = None

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
