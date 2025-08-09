import logging
from pathlib import Path
from typing import Any

import polars as pl
from tqdm import tqdm

from back.scripts.adapters.http_downloader import HttpFileDownloader
from back.scripts.adapters.url_data_source import UrlDataSource
from back.scripts.datasets.entities import FileMetadata
from back.scripts.interfaces.data_source import IDataSource
from back.scripts.interfaces.file_downloader import IFileDownloader
from back.scripts.interfaces.file_parser import IFileParser
from back.scripts.interfaces.workflow import IWorkflow, IWorkflowFactory
from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.polars_operation import normalize_date_pl

LOGGER = logging.getLogger(__name__)


def _normalize_files(
    files: list[FileMetadata],
    downloader: IFileDownloader,
    parser: IFileParser[pl.LazyFrame],
    data_folder: Path,
) -> None:
    """Download, parse, and save normalized versions of financial account files."""
    LOGGER.info(f"Normalizing {len(files)} financial account files...")
    for file_meta in tqdm(files, desc="Normalizing financial account files"):
        norm_path = data_folder / file_meta.url_hash / "norm.parquet"
        if norm_path.exists():
            continue

        raw_path = downloader.download(file_meta)
        if not raw_path:
            LOGGER.warning(f"Failed to download {file_meta.url}, skipping.")
            continue

        parsed_lazy_df = parser.parse(file_meta, raw_path)
        if parsed_lazy_df is not None:
            norm_path.parent.mkdir(exist_ok=True, parents=True)
            parsed_lazy_df.sink_parquet(norm_path)


def _concatenate_normalized_files(data_folder: Path, output_path: Path) -> None:
    """Concatenates all normalized parquet files into a single output file."""
    all_norm_files = list(data_folder.glob("*/norm.parquet"))
    if not all_norm_files:
        LOGGER.warning("No normalized files found to concatenate for Financial Accounts.")
        return

    LOGGER.info(f"Concatenating {len(all_norm_files)} Financial Accounts files...")
    dfs = [pl.scan_parquet(f) for f in all_norm_files]
    concatenated_df = pl.concat(dfs, how="diagonal_relaxed")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    concatenated_df.sink_parquet(output_path)
    LOGGER.info(f"Financial Accounts dataset created at {output_path}")


COLUMN_MAPPINGS = {
    "regions": {
        "exercice": "exer",
        "region": "reg",
        "total_produits": "tpf",
        "total_charges": "tcf",
        "resultat": "rec",
        "subventions": "sub",
        "ressources_invest": "tri",
        "emploi_invest": "tib",
        "ebf": "ebf",
        "caf": "caf",
        "population": "mpoid_bp",
        "dette": "adb",
    },
    "departements": {
        "exercice": "exer",
        "dept": "dep",
        "total_produits": "tpf",
        "total_charges": "tcf",
        "resultat": "rec",
        "subventions": "sub",
        "ressources_invest": "tri",
        "emploi_invest": "tib",
        "ebf": "ebf",
        "caf": "caf",
        "population": "mpoid_bp",
        "dette": "adb",
    },
    "groupements_fiscalite_propre": {
        "siren": "siren",
        "exercice": "exer",
        "dept": "ndept",
        "total_produits": "pftot",
        "total_charges": "cftot",
        "resultat": "rtot",
        "subventions": "suvftot",
        "ressources_invest": "ritot",
        "emploi_invest": "eitot",
        "caf": "caftot",
        "population": "mpoid",
        "dette": "antot",
    },
    "communes": {
        "exercice": "an",
        "insee_commune": "icom",
        "dept": "dep",
        "region": "reg",
        "total_produits": "prod",
        "total_charges": "charge",
        "resultat": "res1",
        "subventions": "subv",
        "ressources_invest": "recinv",
        "emploi_invest": "depinv",
        "ebf": "ebf",
        "caf": "caf",
        "population": "pop1",
        "dette": "annu",
    },
}


class FinancialAccountsFileParser(IFileParser[pl.LazyFrame]):
    """
    Parses a single raw financial accounts data file using Polars.
    """

    def __init__(self):
        self.columns_mapping = COLUMN_MAPPINGS
        self.final_schema: dict[str, Any] = {
            "siren": pl.Utf8,
            "exercice": pl.Datetime(time_unit="us", time_zone="UTC"),
            "insee_commune": pl.Utf8,
            "dept": pl.Utf8,
            "region": pl.Utf8,
            "total_produits": pl.Float64,
            "total_charges": pl.Float64,
            "resultat": pl.Float64,
            "subventions": pl.Float64,
            "ressources_invest": pl.Float64,
            "emploi_invest": pl.Float64,
            "ebf": pl.Float64,
            "caf": pl.Float64,
            "population": pl.Utf8,
            "dette": pl.Float64,
            "annee": pl.Int32,
        }

    def _get_renaming_map(self, file_type: str) -> dict[str, str]:
        """Creates a mapping from raw column names to normalized names."""
        type_mapping = self.columns_mapping.get(file_type)
        if not type_mapping:
            return {}

        # Invert the mapping from {norm: raw} to {raw: norm}
        return {raw_col: norm_col for norm_col, raw_col in type_mapping.items()}

    def parse(self, file_metadata: FileMetadata, raw_filename: Path) -> pl.LazyFrame | None:
        """
        Reads and parses a raw financial accounts data file, applying normalization logic.
        """
        file_type = file_metadata.extra_data.get("type")
        if not file_type:
            LOGGER.warning(f"Missing file type for {raw_filename}, skipping.")
            return None

        renaming_map = self._get_renaming_map(file_type)
        if not renaming_map:
            LOGGER.warning(f"No column mapping found for file type '{file_type}', skipping.")
            return None

        df_lazy = pl.scan_parquet(raw_filename)

        df_renamed = df_lazy.select(list(renaming_map.keys())).rename(renaming_map)

        # Add missing columns with null values
        for col_name, col_type in self.final_schema.items():
            if col_name not in df_renamed.columns:
                df_renamed = df_renamed.with_columns(
                    pl.lit(None, dtype=col_type).alias(col_name)
                )

        return (
            df_renamed.with_columns(pl.col("exercice").cast(pl.Utf8))
            .pipe(normalize_date_pl, id_col="exercice")
            .with_columns(pl.col("exercice").dt.year().alias("annee"))
            .select(list(self.final_schema.keys()))
            .cast(self.final_schema)
        )


class FinancialAccountsWorkflow(IWorkflow):
    """
    Orchestrates the Financial Accounts data processing workflow.
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

    def run(self) -> None:
        if self.output_path.exists():
            LOGGER.info(
                f"Financial Accounts dataset already exists at {self.output_path}, skipping."
            )
            return

        all_files = list(self.data_source.get_files())
        _normalize_files(all_files, self.downloader, self.parser, self.data_folder)
        _concatenate_normalized_files(self.data_folder, self.output_path)


class FinancialAccountsWorkflowFactory(IWorkflowFactory):
    """Factory to create the FinancialAccountsWorkflow from configuration."""

    @classmethod
    def from_config(cls, main_config: dict) -> IWorkflow:
        config_key = "financial_accounts"
        config = main_config[config_key]

        base_path = get_project_base_path()
        files_csv_path = base_path / config["files_csv"]
        data_folder = base_path / config["data_folder"]
        output_path = base_path / config["combined_filename"]

        data_source = UrlDataSource(files_csv_path)
        downloader = HttpFileDownloader(data_folder)
        parser = FinancialAccountsFileParser()

        return FinancialAccountsWorkflow(
            data_source=data_source,
            downloader=downloader,
            parser=parser,
            output_path=output_path,
            data_folder=data_folder,
        )
