import hashlib
import json
import logging
import urllib
from collections import defaultdict
from pathlib import Path
from urllib.error import HTTPError

import pandas as pd
import polars as pl
from tqdm import tqdm

from back.scripts.loaders import LOADER_CLASSES
from back.scripts.utils.config import get_combined_filename, get_project_base_path
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


def _sha256(s):
    return None if pd.isna(s) else hashlib.sha256(s.encode("utf-8")).hexdigest()


class DatasetAggregator:
    """
    Base class for multiple dataset aggregation functionality.

    From a list of urls to download, this class implements the stadard logic of :
    - downloading the raw file into a dedicated folder;
    - converting the raw file into a normalized parquet file;
    - concatenating the individual parquet files into a single combined parquet file;
    - saving the errors.

    This class is designed to be extended by concrete implementations that handle specific
    dataset formats and normalization logic. Subclasses must implement the required methods to define
    how files are read and parsed.

    Required methods for subclasses:
        _read_parse_file(self, file_metadata: tuple) -> pd.DataFrame:
            From a file metadata, this function must read the raw file and apply the normalization logic.
            Args:
                file_metadata: Tuple containing metadata about the file to process
            Returns:
                DataFrame containing the normalized data

    Intermediate files directory and final combined filename are defined in the config,
    respectively as "data_folder" and "combined_filename".
    """

    @classmethod
    def get_config_key(cls) -> str:
        raise NotImplementedError()

    @classmethod
    def get_output_path(cls, main_config: dict) -> Path:
        return get_combined_filename(main_config, cls.get_config_key())

    def __init__(self, files: pd.DataFrame, main_config: dict):
        self._config = main_config[self.get_config_key()]

        self.files_in_scope = files.pipe(self._ensure_url_hash)

        self.data_folder = get_project_base_path() / self._config["data_folder"]
        self.data_folder.mkdir(parents=True, exist_ok=True)
        self.output_filename = self.get_output_path(main_config)
        self.output_filename.parent.mkdir(parents=True, exist_ok=True)
        self.errors = defaultdict(list)

    def _ensure_url_hash(self, frame: pd.DataFrame) -> pd.DataFrame:
        hashes = frame["url"].apply(_sha256)
        if "url_hash" not in frame.columns:
            return frame.assign(url_hash=hashes)
        return frame.fillna({"url_hash": hashes})

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self) -> None:
        if self.output_filename.exists():
            return
        self._process_files()
        self._concatenate_files()
        with open(self.data_folder / "errors.json", "w") as f:
            json.dump(self.errors, f)

    def _process_files(self):
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

        with open(self.data_folder / "errors.json", "w") as f:
            json.dump(self.errors, f)
        self._post_process()
        self._concatenate_files()

    def _post_process(self):
        pass

    def _process_file(self, file: tuple) -> None:
        """
        Download and normalize a spécific file.
        """
        self._download_file(file)
        self._normalize_file(file)

    def _download_file(self, file_metadata: tuple):
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

    def _dataset_filename(self, file_metadata: tuple, step: str):
        """
        Expected path for a given file depending on the step (raw or norm).
        """
        return (
            self.data_folder
            / file_metadata.url_hash
            / f"{step}.{file_metadata.format if step == 'raw' else 'parquet'}"
        )

    def _normalize_file(self, file_metadata: tuple) -> pd.DataFrame:
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

    def _read_parse_file(self, file_metadata: tuple, raw_filename: Path) -> pd.DataFrame | None:
        raise NotImplementedError()

    def _remaining_to_normalize(self):
        """
        Select among the input files the ones for which we do not have yet the normalized file.
        """
        current = pd.DataFrame(
            {
                "url_hash": [
                    str(x.parent.name) for x in self.data_folder.glob("*/norm.parquet")
                ],
                "exists": 1,
            }
        )
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

    def _add_normalized_filenames(self):
        """
        Add to the DataFrame of input files the expected name of the normalized file.
        """
        all_files = list(self.files_in_scope.itertuples(index=False))
        fns = [str(self._dataset_filename(file, "norm")) for file in all_files]
        self.files_in_scope = self.files_in_scope.assign(filename=fns)

    def _concatenate_files(self):
        """
        Concatenate all the normalized files which have succeeded into a single parquet file.
        This step is made in polars as the sum of all dataset by be heavy on memory.
        """
        all_files = list(self.data_folder.glob("*/norm.parquet"))
        LOGGER.info(f"Concatenating {len(all_files)} files for {str(self.output_filename)}")
        dfs = [pl.scan_parquet(f) for f in all_files]
        df = pl.concat(dfs, how="diagonal_relaxed")
        df.sink_parquet(self.output_filename)

    @property
    def aggregated_dataset(self):
        """
        Property to return the aggregated dataset.
        """
        if not self.output_filename.exists():
            raise RuntimeError("Combined file does not exists. You must run .load() first.")
        return pd.read_parquet(self.output_filename)
