import hashlib
import json
import logging
import urllib.request
from collections import defaultdict
from pathlib import Path
from urllib.error import HTTPError

import pandas as pd
import polars as pl
from tqdm import tqdm

from back.scripts.datasets.utils import BaseDataset
from back.scripts.loaders import LOADER_CLASSES, BaseLoader
from back.scripts.utils.decorators import tracker
from back.scripts.utils.typing import PandasRow

LOGGER = logging.getLogger(__name__)


def _sha256(s: str | None) -> str | None:
    """
    Generate SHA256 hash from a string.

    Args:
        s (str | None): string to hash.
    Returns:
        s (str | None): hexadecimal SHA256 hash of the input string, or None if input is NaN.
    """
    return None if pd.isna(s) else hashlib.sha256(s.encode("utf-8")).hexdigest()


class DatasetAggregator(BaseDataset):
    """
    Base class for multiple dataset aggregation functionality.

    From a list of urls to download, this class implements the standard logic of :
    - downloading the raw file into a dedicated folder;
    - converting the raw file into a normalized parquet file;
    - concatenating the individual parquet files into a single combined parquet file;
    - saving the errors.

    This class is designed to be extended by concrete implementations that handle specific
    dataset formats and normalization logic. Subclasses must implement the required methods to define
    how files are read and parsed.

    Required methods for subclasses:
        _read_parse_file(self, file_metadata: PandasRow) -> pd.DataFrame:
            From a file metadata, this function must read the raw file and apply the normalization logic.
            Args:
                file_metadata: NamedTuple containing metadata about the file to process
            Returns:
                DataFrame containing the normalized data

    Intermediate files directory and final combined filename are defined in the config.yaml file,
    respectively as "data_folder" and "combined_filename".
    """

    def __init__(self, files: pd.DataFrame, main_config: dict):
        """
        Initialize a DatasetAggregator Instance which inherits attributes from BaseDataset.
        """
        super().__init__(main_config)
        self.files_in_scope = files.pipe(self._ensure_url_hash)
        self.errors = defaultdict(list)

    def _ensure_url_hash(self, frame: pd.DataFrame) -> pd.DataFrame:
        """
        Ensure each url in the "url" column has a corresponding SHA-256 hash.
        If the "url_hash" column is missing, a new column is added to the dataframe, using hashed version of "url" column
        If "url_hash" column exists, the NA values are replaced by hashed version of "url" column.
        Args:
            frame(pd.DataFrame): DataFrame containing an "url" column.
        Returns:
            pd.DataFrame : The dataframe containing a new or updated "url_hash" column.
        """
        hashes = frame["url"].apply(_sha256)
        if "url_hash" not in frame.columns:
            return frame.assign(url_hash=hashes)
        return frame.fillna({"url_hash": hashes})

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self) -> None:
        if self.output_filename.exists():
            return
        self._process_files()
        self._post_process()
        self._concatenate_files()
        with open(self.data_folder / "errors.json", "w") as f:
            json.dump(self.errors, f)

    def _process_files(self) -> None:
        for file_infos in tqdm(self._remaining_to_normalize()):
            if file_infos.format not in LOADER_CLASSES:
                LOGGER.warning(f"Format {file_infos.format} not supported")
                continue

            if file_infos.url is None or pd.isna(file_infos.url):
                LOGGER.warning(f"URL not specified for file {file_infos.title}")
                continue

            try:
                self._process_file(file_infos)
            except Exception as e:
                LOGGER.warning(f"Failed to process file {file_infos.url}: {e}")
                self.errors[str(e)].append(file_infos.url)

    def _post_process(self) -> None:
        pass

    def _process_file(self, file: PandasRow) -> None:
        """
        Download and normalize a spécific file.
        """
        self._download_file(file)
        self._normalize_file(file)

    def _download_file(self, file_metadata: PandasRow) -> None:
        """
        Save locally the output of the URL.
        """
        output_filename = self._dataset_filename(file_metadata, "raw")
        if output_filename.exists():
            LOGGER.debug(f"File {output_filename} already exists, skipping")
            return
        output_filename.parent.mkdir(exist_ok=True, parents=True)
        try:
            urllib.request.urlretrieve(file_metadata.url, output_filename)
        except HTTPError as error:
            LOGGER.warning(f"Failed to download file {file_metadata.url}: {error}")
            msg = (
                f"HTTP error {error.code} while expecting {file_metadata.resource_status} code"
            )
            self.errors[msg].append(file_metadata.url)
        except Exception as e:
            LOGGER.warning(f"Failed to download file {file_metadata.url}: {e}")
            self.errors[str(e)].append(file_metadata.url)
        LOGGER.debug(f"Downloaded file {file_metadata.url}")

    def _dataset_filename(self, file_metadata: PandasRow, step: str) -> Path:
        """
        Expected path for a given file depending on the step (raw or norm).
        """
        return (
            self.data_folder
            / file_metadata.url_hash
            / f"{step}.{file_metadata.format if step == 'raw' else 'parquet'}"
        )

    def _normalize_file(self, file_metadata: PandasRow) -> None:
        out_filename = self._dataset_filename(file_metadata, "norm")
        if out_filename.exists():
            LOGGER.debug(f"File {out_filename} already exists, skipping")
            return

        raw_filename = self._dataset_filename(file_metadata, "raw")
        if not raw_filename.exists():
            LOGGER.debug(f"File {raw_filename} does not exist, skipping")
            return
        df = self._read_parse_file(file_metadata, raw_filename)
        if isinstance(df, pd.DataFrame):
            df.to_parquet(out_filename, index=False)

    def _read_parse_file(
        self, file_metadata: PandasRow, raw_filename: Path
    ) -> pd.DataFrame | None:
        opts = {"dtype": str} if file_metadata.format == "csv" else {}
        loader = BaseLoader.loader_factory(raw_filename, **opts)
        try:
            df = loader.load()
            if not isinstance(df, pd.DataFrame):
                LOGGER.error(f"Unable to load file into a DataFrame = {file_metadata.url}")
                raise RuntimeError("Unable to load file into a DataFrame")
            return df.pipe(self._normalize_frame, file_metadata)
        except Exception as e:
            self.errors[str(e)].append(raw_filename.parent.name)

    def _normalize_frame(self, df: pd.DataFrame, file_metadata: PandasRow):
        raise NotImplementedError()

    def _remaining_to_normalize(self) -> list:
        """
        Select among the input files the ones for which we do not have yet the normalized file.
        """
        current = pd.DataFrame(
            {
                "url_hash": [
                    str(x.parent.name) for x in self.data_folder.glob("*/norm.parquet")
                ],
                "exists": 1,
            },
        ).assign(url_hash=lambda df: df["url_hash"].astype(str).where(df["url_hash"].notnull()))
        return list(
            self.files_in_scope.merge(
                current,
                how="left",
                on="url_hash",
            )
            .pipe(lambda df: df[df["exists"].isnull()])
            .drop(columns="exists")
            .itertuples()
        )

    def _add_normalized_filenames(self) -> None:
        """
        Add to the DataFrame of input files the expected name of the normalized file.
        """
        all_files = list(self.files_in_scope.itertuples(index=False))
        fns = [str(self._dataset_filename(file, "norm")) for file in all_files]
        self.files_in_scope = self.files_in_scope.assign(filename=fns)

    def _concatenate_files(self) -> None:
        """
        Concatenate all the normalized files which have succeeded into a single parquet file.
        This step is made in polars as the sum of all dataset by be heavy on memory.
        """
        all_files = list(self.data_folder.glob("*/norm.parquet"))
        LOGGER.info(f"Concatenating {len(all_files)} files for {str(self.output_filename)}")
        dfs = [pl.scan_parquet(f) for f in all_files]
        df = pl.concat(dfs, how="diagonal_relaxed")
        df.sink_parquet(self.output_filename)
