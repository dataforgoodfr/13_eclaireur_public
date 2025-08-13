import json
import logging
from datetime import date, datetime, time
from pathlib import Path
from typing import Any, Callable

import pandera.polars as pa
import polars as pl
from jsonschema import SchemaError, ValidationError, validate
from tqdm import tqdm

from back.scripts.adapters.data_source_checker import ApiChecker
from back.scripts.adapters.http_downloader import HttpFileDownloader
from back.scripts.adapters.url_data_source import UrlDataSource
from back.scripts.datasets.entities import FileMetadata
from back.scripts.entities.ofgl import Ofgl2024RecordDataframe
from back.scripts.interfaces.data_source import IDataSource
from back.scripts.interfaces.file_checker import IFileUpdateChecker
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

CHANGELOG_BASE_URL = "https://data.ofgl.fr/api/records/1.0/search/?sort=date&refine.jeu_donnees={datasetid}&rows=1&dataset=historique-maj-jeux-donnees&timezone=Europe%2FBerlin&lang=fr"


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
        checker: IFileUpdateChecker,
        downloader: IFileDownloader,
        parser: IFileParser,
        output_path: Path,
        data_folder: Path,
    ):
        self.data_source = data_source
        self.checker = checker
        self.downloader = downloader
        self.parser = parser
        self.output_path = output_path
        self.data_folder = data_folder

    def get_output_path(self) -> Path:
        return self.output_path

    def run(self) -> None:
        all_files = self.data_source.get_files()
        for file_meta in tqdm(all_files, desc="Processing OFGL files"):
            file_meta.data_folder = self.data_folder

            self.checker.need_update(file_meta)

            norm_path = file_meta.get_norm_path()
            val_path = file_meta.get_validation_path()
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

        if self.checker.need_rebuild():
            self._concatenate_files()
        else:
            LOGGER.info(f"OFGL dataset already exists at {self.output_path}, skipping.")

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


class OfglApiChecker(ApiChecker):
    """ """

    def __init__(self, schema_path):
        super().__init__(url_pattern=CHANGELOG_BASE_URL, comparator=self._ofgl_file_comparator)
        self.schema_path = schema_path
        with open(self.schema_path, "r") as f:
            self.schema = json.load(f)

    def _ofgl_file_comparator(self, remote: Any, local: FileMetadata):
        """
        return if remote is more recent than local, so update is requiered
        """

        try:
            validate(instance=remote, schema=self.schema)
            d = date.fromisoformat(remote["records"][0]["fields"]["date"])
            remote_dt = datetime.combine(d, time.min)

            raw_path = local.get_raw_path()
            raw_path_stat = raw_path.stat()
            local_dt = datetime.fromtimestamp(raw_path_stat.st_mtime)

            return remote_dt > local_dt

        except SchemaError as se:
            LOGGER.error(f"Schema provide by {self.schema_path} is not valid")
        except ValidationError as se:
            LOGGER.error(f"API Response don't match with Schema provide by {self.schema_path}")

        return None


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
        schema_path = base_path / ofgl_config["api_schema"]

        data_source = UrlDataSource(urls_csv_path)
        update_checker = OfglApiChecker(schema_path)
        downloader = HttpFileDownloader(data_folder)
        parser = OfglFileParser()

        return OfglWorkflow(
            data_source=data_source,
            checker=update_checker,
            downloader=downloader,
            parser=parser,
            output_path=output_path,
            data_folder=data_folder,
        )
