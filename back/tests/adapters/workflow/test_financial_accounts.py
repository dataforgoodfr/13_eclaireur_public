import hashlib
import logging
from pathlib import Path
from unittest.mock import MagicMock, patch

import polars as pl
import pytest

from back.scripts.adapters.workflow.financial_accounts import (
    FinancialAccountsFileParser,
    FinancialAccountsWorkflow,
    FinancialAccountsWorkflowFactory,
)
from back.scripts.datasets.entities import FileMetadata
from back.scripts.interfaces.data_source import IDataSource
from back.scripts.interfaces.file_downloader import IFileDownloader
from back.scripts.interfaces.file_parser import IFileParser

# Configure logging for tests
logging.basicConfig(level=logging.DEBUG)


def _sha256(s: str) -> str | None:
    if s is None:
        return None
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


@pytest.fixture
def base_data_folder(tmp_path: Path) -> Path:
    """Fixture for a temporary data folder."""
    return tmp_path


@pytest.fixture
def columns_mapping() -> dict[str, list]:
    """Fixture for a realistic columns mapping."""
    return {
        "name": [
            "siren",
            "exercice",
            "insee_commune",
            "dept",
            "region",
            "total_produits",
            "total_charges",
            "resultat",
            "subventions",
            "ressources_invest",
            "emploi_invest",
            "ebf",
            "caf",
            "population",
            "dette",
        ],
        "regions": [
            None,
            "exer",
            None,
            None,
            "reg",
            "tpf",
            "tcf",
            "rec",
            "sub",
            "tri",
            "tib",
            "ebf",
            "caf",
            "mpoid_bp",
            "adb",
        ],
        "departements": [
            None,
            "exer",
            None,
            "dep",
            None,
            "tpf",
            "tcf",
            "rec",
            "sub",
            "tri",
            "tib",
            "ebf",
            "caf",
            "mpoid_bp",
            "adb",
        ],
        "groupements_fiscalite_propre": [
            "siren",
            "exer",
            None,
            "ndept",
            None,
            "pftot",
            "cftot",
            "rtot",
            "suvftot",
            "ritot",
            "eitot",
            None,
            "caftot",
            "mpoid",
            "antot",
        ],
        "communes": [
            None,
            "an",
            "icom",
            "dep",
            "reg",
            "prod",
            "charge",
            "res1",
            "subv",
            "recinv",
            "depinv",
            "ebf",
            "caf",
            "pop1",
            "annu",
        ],
    }


@pytest.fixture
def file_metadata() -> FileMetadata:
    """Fixture for sample file metadata."""
    url = "http://example.com/testfile.csv"
    return FileMetadata(
        url=url,
        url_hash=_sha256(url) or "",
        format="csv",
        extra_data={"type": "communes"},
    )


@pytest.fixture
def mock_data_source(file_metadata: FileMetadata) -> MagicMock:
    mock = MagicMock(spec=IDataSource)
    mock.get_files.return_value = [file_metadata]
    return mock


@pytest.fixture
def mock_downloader(base_data_folder: Path, file_metadata: FileMetadata) -> MagicMock:
    mock = MagicMock(spec=IFileDownloader)
    raw_path = base_data_folder / file_metadata.url_hash / f"raw.{file_metadata.format}"
    raw_path.parent.mkdir(parents=True, exist_ok=True)
    pl.DataFrame(
        {
            "SIREN": ["123456789"],
            "EXERCICE": ["2023"],
            "POPULATION": [1000],
        }
    ).write_csv(raw_path, separator=";")
    mock.download.return_value = raw_path
    return mock


@pytest.fixture
def mock_parser() -> MagicMock:
    mock = MagicMock(spec=IFileParser)
    mock.parse.return_value = pl.LazyFrame(
        {
            "siren": ["123456789"],
            "exercice": ["2023-01-01T00:00:00+00:00"],
            "population": [1000],
            "annee": [2023],
            "type": ["type1"],
        }
    )
    return mock


class TestFinancialAccountsFileParser:
    def test_parse_success(
        self, file_metadata: FileMetadata, columns_mapping: dict[str, list], tmp_path: Path
    ):
        # Given: A valid raw financial accounts data file
        parser = FinancialAccountsFileParser(columns_mapping)
        raw_df = pl.DataFrame(
            {
                "siren": ["123456789"],
                "an": ["2023"],
                "icom": ["12345"],
                "dep": ["01"],
                "reg": ["84"],
                "prod": [1000],
                "charge": [800],
                "res1": [200],
                "subv": [100],
                "recinv": [500],
                "depinv": [400],
                "ebf": [300],
                "caf": [400],
                "pop1": [1000],
                "annu": [50],
            }
        )
        raw_path = tmp_path / "raw.csv"
        raw_df.write_csv(raw_path, separator=";")

        # When: The parse method is called
        result_lazy_df = parser.parse(file_metadata, raw_path)
        assert result_lazy_df is not None
        result_df = result_lazy_df.collect()

        # Then: The dataframe is parsed and normalized correctly
        assert "insee_commune" in result_df.columns
        assert result_df["insee_commune"][0] == 12345
        assert "exercice" in result_df.columns
        assert "population" in result_df.columns
        assert "annee" in result_df.columns
        assert "type" in result_df.columns
        assert result_df["annee"][0] == 2023
        assert result_df["type"][0] == "communes"


class TestFinancialAccountsWorkflow:
    def test_run_success(
        self,
        mock_data_source: MagicMock,
        mock_downloader: MagicMock,
        mock_parser: MagicMock,
        tmp_path: Path,
    ):
        # Given: A complete Financial Accounts workflow setup
        output_path = tmp_path / "financial_accounts_combined.parquet"
        data_folder = tmp_path / "data"
        workflow = FinancialAccountsWorkflow(
            data_source=mock_data_source,
            downloader=mock_downloader,
            parser=mock_parser,
            output_path=output_path,
            data_folder=data_folder,
        )

        # When: The run method is called
        workflow.run()

        # Then: The workflow executes successfully
        mock_data_source.get_files.assert_called_once()
        mock_downloader.download.assert_called_once()
        mock_parser.parse.assert_called_once()
        assert output_path.exists()


class TestFinancialAccountsWorkflowFactory:
    @patch("back.scripts.adapters.workflow.financial_accounts.get_project_base_path")
    def test_from_config(
        self, mock_get_base_path, tmp_path: Path, columns_mapping: dict[str, list]
    ):
        # Given: A mock configuration and project path
        mock_get_base_path.return_value = tmp_path
        files_csv_path = tmp_path / "files.csv"
        files_csv_path.touch()
        columns_mapping_path = tmp_path / "columns_mapping.csv"
        pl.DataFrame(columns_mapping).write_csv(columns_mapping_path, separator=";")
        config = {
            "financial_accounts": {
                "files_csv": "files.csv",
                "columns_mapping": str(columns_mapping_path),
                "data_folder": "data",
                "combined_filename": "combined.parquet",
            }
        }

        # When: The from_config method is called
        workflow = FinancialAccountsWorkflowFactory.from_config(config)

        # Then: A FinancialAccountsWorkflow instance is created with the correct parameters
        assert isinstance(workflow, FinancialAccountsWorkflow)
        assert workflow.output_path == tmp_path / "combined.parquet"
