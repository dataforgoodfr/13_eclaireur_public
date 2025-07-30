import hashlib
import logging
from pathlib import Path
from unittest.mock import MagicMock, patch

import pandas as pd
import pandera.polars as pa
import polars as pl
import pytest
import responses

from back.scripts.adapters.workflow.ofgl import (
    OfglFileParser,
    OfglWorkflow,
    OfglWorkflowFactory,
)
from back.scripts.datasets.entities import FileMetadata
from back.scripts.entities.ofgl import Ofgl2024RecordDataframe
from back.scripts.interfaces.data_source import IDataSource
from back.scripts.interfaces.file_downloader import IFileDownloader
from back.scripts.interfaces.file_parser import IFileParser
from back.scripts.utils.config import get_project_base_path

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
def file_metadata() -> FileMetadata:
    """Fixture for sample file metadata."""
    url = "http://example.com/testfile.csv"
    return FileMetadata(
        url=url,
        url_hash=_sha256(url) or "",
        format="csv",
        extra_data={"code": "COM"},
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
    # Create a dummy CSV file for testing
    pd.DataFrame(
        {
            "Exercice": [2023],
            "Outre-mer": ["non"],
            "Catégorie": ["COMMUNE"],
            "Population totale": [1000],
            "Code Insee Collectivité": ["01001"],
            "Code Siren Collectivité": ["210100100"],
            "Code Insee 2024 Département": ["01"],
            "Code Insee 2024 Région": ["84"],
        }
    ).to_csv(raw_path, sep=";", index=False)
    mock.download.return_value = raw_path
    return mock


@pytest.fixture
def mock_parser() -> MagicMock:
    mock = MagicMock(spec=IFileParser)
    mock.parse.return_value = pl.LazyFrame(
        {
            "siren": ["210100100"],
            "code_insee": ["01001"],
            "population": [1000],
        }
    )
    return mock


class TestOfglFileParser:
    def test_parse_success(self, file_metadata: FileMetadata, tmp_path: Path):
        # Given: A valid raw OFGL data file
        parser = OfglFileParser()
        raw_df = pd.DataFrame(
            {
                "Exercice": [2023],
                "Outre-mer": ["non"],
                "Catégorie": ["COMMUNE"],
                "Population totale": [1000],
                "Code Insee Collectivité": ["01001"],
                "Code Siren Collectivité": ["210100100"],
                "Code Insee 2024 Département": ["01"],
                "Code Insee 2024 Région": ["84"],
            }
        )
        raw_path = tmp_path / "raw.csv"
        raw_df.to_csv(raw_path, sep=";", index=False)

        # When: The parse method is called
        result_lazy_df = parser.parse(file_metadata, raw_path)
        assert result_lazy_df is not None
        result_df = result_lazy_df.collect()

        # Then: The dataframe is parsed and normalized correctly
        assert "siren" in result_df.columns
        assert "code_insee" in result_df.columns
        assert result_df["siren"][0] == "210100100"
        assert result_df["outre_mer"][0] is False

    def test_parse_validation_error(self, file_metadata: FileMetadata, tmp_path: Path, caplog):
        # Given: An invalid raw OFGL data file
        parser = OfglFileParser()
        raw_df = pd.DataFrame(
            {
                "Exercice": [2023],
                "Outre-mer": ["non"],
                "Catégorie": ["COMMUNE"],
                "Population totale": [1000],
                "Code Insee Collectivité": ["01001"],
                "Code Siren Collectivité": ["123456789"],  # Invalid SIREN
                "Code Insee 2024 Département": ["01"],
                "Code Insee 2024 Région": ["84"],
            }
        )
        raw_path = tmp_path / "raw.csv"
        raw_df.to_csv(raw_path, sep=";", index=False)

        # When: The parse method is called
        with caplog.at_level(logging.ERROR):
            result_lazy_df = parser.parse(file_metadata, raw_path)

        # Then: The validation fails and an error is logged
        assert result_lazy_df is not None
        assert "OFGL data validation failed" in caplog.text
        validation_path = raw_path.parent / "validation.parquet"
        assert validation_path.exists()


class TestOfglWorkflow:
    def test_run_success(
        self,
        mock_data_source: MagicMock,
        mock_downloader: MagicMock,
        mock_parser: MagicMock,
        tmp_path: Path,
    ):
        # Given: A complete OFGL workflow setup
        output_path = tmp_path / "ofgl_combined.parquet"
        data_folder = tmp_path / "data"
        workflow = OfglWorkflow(
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

    def test_run_already_exists(
        self,
        mock_data_source: MagicMock,
        mock_downloader: MagicMock,
        mock_parser: MagicMock,
        tmp_path: Path,
        caplog,
    ):
        # Given: The output file already exists
        output_path = tmp_path / "ofgl_combined.parquet"
        output_path.touch()
        data_folder = tmp_path / "data"
        workflow = OfglWorkflow(
            data_source=mock_data_source,
            downloader=mock_downloader,
            parser=mock_parser,
            output_path=output_path,
            data_folder=data_folder,
        )

        # When: The run method is called
        with caplog.at_level(logging.INFO):
            workflow.run()

        # Then: The workflow skips execution
        mock_data_source.get_files.assert_not_called()
        assert "OFGL dataset already exists" in caplog.text

    def test_concatenate_files(self, tmp_path: Path):
        # Given: Multiple normalized parquet files
        data_folder = tmp_path / "data"
        output_path = tmp_path / "ofgl_combined.parquet"
        workflow = OfglWorkflow(
            MagicMock(spec=IDataSource),
            MagicMock(spec=IFileDownloader),
            MagicMock(spec=IFileParser),
            output_path,
            data_folder,
        )

        # Create dummy normalized files
        for i in range(3):
            norm_folder = data_folder / f"hash_{i}"
            norm_folder.mkdir(parents=True)
            df = pl.DataFrame({"data": [i]})
            df.write_parquet(norm_folder / "norm.parquet")

        # When: The _concatenate_files method is called
        workflow._concatenate_files()

        # Then: The files are concatenated into a single output file
        assert output_path.exists()
        result_df = pl.read_parquet(output_path)
        assert len(result_df) == 3


class TestOfglWorkflowFactory:
    @patch("back.scripts.adapters.workflow.ofgl.get_project_base_path")
    def test_from_config(self, mock_get_base_path, tmp_path: Path):
        # Given: A mock configuration and project path
        mock_get_base_path.return_value = tmp_path
        urls_csv_path = tmp_path / "urls.csv"
        urls_csv_path.touch()
        config = {
            "ofgl": {
                "urls_csv": "urls.csv",
                "data_folder": "data",
                "combined_filename": "combined.parquet",
            }
        }

        # When: The from_config method is called
        workflow = OfglWorkflowFactory.from_config(config)

        # Then: An OfglWorkflow instance is created with the correct parameters
        assert isinstance(workflow, OfglWorkflow)
        assert workflow.output_path == tmp_path / "combined.parquet"
