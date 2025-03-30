import os
import tempfile
from pathlib import Path

import pandas as pd
import pytest
import responses

from back.scripts.loaders.csv_loader import (
    CSVLoader,  # Assuming the class is in a file named csv_loader.py
)


class TestCSVLoader:
    # Sample CSV data with different delimiters
    COMMA_CSV = "name,age,city\nJohn,30,New York\nAnna,25,Los Angeles\nPeter,45,Chicago"
    SEMICOLON_CSV = "name;age;city\nJohn;30;New York\nAnna;25;Los Angeles\nPeter;45;Chicago"
    TAB_CSV = "name\tage\tcity\nJohn\t30\tNew York\nAnna\t25\tLos Angeles\nPeter\t45\tChicago"
    PIPE_CSV = "name|age|city\nJohn|30|New York\nAnna|25|Los Angeles\nPeter|45|Chicago"
    EMPTY_FIRST_LINE_CSV = (
        "\nname,age,city\n,30,New York\nJohn,25,Los Angeles\nPeter,45,Chicago"
    )

    # CSV with different encoding
    UTF8_CSV = "name,age,city\nJosé,30,São Paulo\nMarie,25,Köln\nPierre,45,Montréal"
    LATIN1_CSV = (
        "name,age,city\nJos\xe9,30,S\xe3o Paulo\nMarie,25,K\xf6ln\nPierre,45,Montr\xe9al"
    )

    # Bad CSV with inconsistent columns
    BAD_CSV = "name,age,city\nJohn,30,New York\nAnna,Los Angeles\nPeter,45,Chicago,USA"

    @pytest.fixture
    def setup_temp_csv_files(self):
        """Create temporary CSV files with different formats for testing."""
        temp_files = {}

        with tempfile.TemporaryDirectory() as temp_dir:
            files_data = {
                "comma.csv": self.COMMA_CSV,
                "semicolon.csv": self.SEMICOLON_CSV,
                "tab.csv": self.TAB_CSV,
                "pipe.csv": self.PIPE_CSV,
                "utf8.csv": self.UTF8_CSV,
                "bad.csv": self.BAD_CSV,
                "empty_first_line.csv": self.EMPTY_FIRST_LINE_CSV,
            }

            for filename, data in files_data.items():
                file_path = os.path.join(temp_dir, filename)
                encoding = "utf-8"

                # Special case for latin1 encoding
                if filename == "latin1.csv":
                    with open(os.path.join(temp_dir, filename), "wb") as f:
                        f.write(self.LATIN1_CSV.encode("latin1"))
                    temp_files[filename] = os.path.join(temp_dir, filename)
                    continue

                with open(file_path, "w", encoding=encoding) as f:
                    f.write(data)

                temp_files[filename] = file_path

            yield temp_files

    @responses.activate
    def test_load_from_url_comma(self):
        """Test loading a comma-delimited CSV from a URL."""
        url = "http://example.com/data.csv"
        responses.add(
            responses.GET, url, body=self.COMMA_CSV, status=200, content_type="text/csv"
        )

        loader = CSVLoader(url)
        df = loader.load()

        assert df is not None
        assert isinstance(df, pd.DataFrame)
        assert df.shape == (3, 3)
        assert list(df.columns) == ["name", "age", "city"]
        assert df.iloc[0]["name"] == "John"

    @responses.activate
    def test_load_from_url_semicolon(self):
        """Test loading a semicolon-delimited CSV from a URL."""
        url = "http://example.com/data.csv"
        responses.add(
            responses.GET, url, body=self.SEMICOLON_CSV, status=200, content_type="text/csv"
        )

        loader = CSVLoader(url)
        df = loader.load()

        assert df is not None
        assert isinstance(df, pd.DataFrame)
        assert df.shape == (3, 3)
        assert list(df.columns) == ["name", "age", "city"]
        assert df.iloc[0]["name"] == "John"

    @responses.activate
    def test_load_from_url_failed(self):
        """Test handling of failed URL request."""
        url = "http://example.com/data.csv"
        responses.add(responses.GET, url, status=404)

        loader = CSVLoader(url)

        with pytest.raises(RuntimeError):
            loader.load()

    def test_load_from_file_comma(self, setup_temp_csv_files):
        """Test loading a comma-delimited CSV from a file."""
        file_path = Path(setup_temp_csv_files["comma.csv"])

        loader = CSVLoader(file_path)
        df = loader.load()

        assert df is not None
        assert isinstance(df, pd.DataFrame)
        assert df.shape == (3, 3)
        assert list(df.columns) == ["name", "age", "city"]
        assert df.iloc[0]["name"] == "John"

    def test_load_from_file_semicolon(self, setup_temp_csv_files):
        """Test loading a semicolon-delimited CSV from a file."""
        file_path = setup_temp_csv_files["semicolon.csv"]

        loader = CSVLoader(file_path)
        df = loader.load()

        assert df is not None
        assert isinstance(df, pd.DataFrame)
        assert df.shape == (3, 3)
        assert list(df.columns) == ["name", "age", "city"]
        assert df.iloc[0]["name"] == "John"

    def test_load_from_file_tab(self, setup_temp_csv_files):
        """Test loading a tab-delimited CSV from a file."""
        file_path = setup_temp_csv_files["tab.csv"]

        loader = CSVLoader(file_path)
        df = loader.load()

        assert df is not None
        assert isinstance(df, pd.DataFrame)
        assert df.shape == (3, 3)
        assert list(df.columns) == ["name", "age", "city"]
        assert df.iloc[0]["name"] == "John"

    def test_load_from_file_pipe(self, setup_temp_csv_files):
        """Test loading a pipe-delimited CSV from a file."""
        file_path = setup_temp_csv_files["pipe.csv"]

        loader = CSVLoader(file_path)
        df = loader.load()

        assert df is not None
        assert isinstance(df, pd.DataFrame)
        assert df.shape == (3, 3)
        assert list(df.columns) == ["name", "age", "city"]
        assert df.iloc[0]["name"] == "John"

    def test_load_from_file_utf8(self, setup_temp_csv_files):
        """Test loading a UTF-8 encoded CSV file."""
        file_path = setup_temp_csv_files["utf8.csv"]

        loader = CSVLoader(file_path)
        df = loader.load()

        assert df is not None
        assert isinstance(df, pd.DataFrame)
        assert df.shape == (3, 3)
        assert df.iloc[0]["name"] == "José"
        assert df.iloc[1]["city"] == "Köln"

    def test_load_from_file_nonexistent(self):
        """Test handling of nonexistent file."""
        file_path = "/path/to/nonexistent/file.csv"

        loader = CSVLoader(file_path)
        df = loader.load()

        assert df is None

    def test_columns_to_keep(self, setup_temp_csv_files):
        """Test loading only specific columns."""
        file_path = setup_temp_csv_files["comma.csv"]

        loader = CSVLoader(file_path, columns=["name", "city"])
        df = loader.load()

        assert df is not None
        assert isinstance(df, pd.DataFrame)
        assert df.shape == (3, 2)
        assert list(df.columns) == ["name", "city"]
        assert "age" not in df.columns

    def test_dtype_specification(self, setup_temp_csv_files):
        """Test specifying column data types."""
        file_path = setup_temp_csv_files["comma.csv"]

        loader = CSVLoader(file_path, dtype={"age": str})
        df = loader.load()

        assert df is not None
        assert isinstance(df, pd.DataFrame)
        assert df["age"].dtype == object  # str columns are object dtype in pandas

    def test_open_csv_with_empty_first_line(self, setup_temp_csv_files):
        file_path = setup_temp_csv_files["empty_first_line.csv"]

        loader = CSVLoader(file_path, dtype={"age": str})
        df = loader.load()
        expected = pd.DataFrame(
            {
                "name": [None, "John", "Peter"],
                "age": ["30", "25", "45"],
                "city": ["New York", "Los Angeles", "Chicago"],
            }
        )
        pd.testing.assert_frame_equal(df, expected)

    def test_bad_csv(self, setup_temp_csv_files):
        """Test loading a CSV with inconsistent columns."""
        file_path = setup_temp_csv_files["bad.csv"]

        loader = CSVLoader(file_path)
        df = loader.load()

        assert df is not None
        assert isinstance(df, pd.DataFrame)
        # Should skip bad lines or handle them gracefully
        assert df.shape[0] > 0  # Should skip bad lines or handle them gracefully
        assert df.shape[0] > 0
        # Should skip bad lines or handle them gracefully
        assert df.shape[0] > 0  # Should skip bad lines or handle them gracefully
        assert df.shape[0] > 0
