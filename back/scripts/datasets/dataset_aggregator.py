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
from back.scripts.utils.config import get_project_base_path

LOGGER = logging.getLogger(__name__)


def _sha256(s):
    return None if pd.isna(s) else hashlib.sha256(s.encode("utf-8")).hexdigest()


class DatasetAggregator:
    def __init__(self, files: pd.DataFrame, config: dict):
        self._config = config

        self.files_in_scope = files.assign(url_hash=lambda df: df["url"].apply(_sha256))

        self.data_folder = get_project_base_path() / (config["data_folder"])
        self.data_folder.mkdir(parents=True, exist_ok=True)
        self.combined_filename = get_project_base_path() / (config["combined_filename"])
        self.errors = defaultdict(list)

        self._add_filenames()

    def run(self) -> None:
        for file_infos in tqdm(self._files_to_run()):
            if file_infos.format not in LOADER_CLASSES:
                LOGGER.warning(f"Format {file_infos.format} not supported")
                continue

            if file_infos.url is None or pd.isna(file_infos.url):
                LOGGER.warning(f"URL not specified for file {file_infos.title}")
                continue

            self._treat_file(file_infos)

        self._concatenate_files()
        with open(self.data_folder / "errors.json", "w") as f:
            json.dump(self.errors, f)
        return self

    def _treat_file(self, file: tuple) -> None:
        """
        Download and normalize a spécific file.
        """
        self._download_file(file)
        self._normalize_file(file)

    def _download_file(self, file_metadata: tuple):
        """
        Save locally the output of the URL.
        """
        output_filename = self.dataset_filename(file_metadata, "raw")
        if output_filename.exists():
            LOGGER.debug(f"File {output_filename} already exists, skipping")
            return
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

    def dataset_filename(self, file: tuple, step: str):
        """
        Expected path for a given file depending on the step (raw or norm).
        """
        return (
            self.data_folder
            / f"{file.url_hash}_{step}.{file.format if step == 'raw' else 'parquet'}"
        )

    def _normalize_file(self, file_metadata: tuple) -> pd.DataFrame:
        out_filename = self.dataset_filename(file_metadata, "norm")
        if out_filename.exists():
            LOGGER.debug(f"File {out_filename} already exists, skipping")
            return

        raw_filename = self.dataset_filename(file_metadata, "raw")
        if not raw_filename.exists():
            LOGGER.debug(f"File {raw_filename} does not exist, skipping")
            return
        df = self._read_parse_file(file_metadata, raw_filename)
        if isinstance(df, pd.DataFrame):
            df.to_parquet(out_filename)

    def _read_parse_file(self, file_metadata: tuple, raw_filename: Path) -> pd.DataFrame | None:
        raise NotImplementedError()

    def _files_to_run(self):
        """
        Select among the input files the ones for which we do not have yet the normalized file.
        """
        current = pd.DataFrame(
            {"filename": [str(x) for x in self.data_folder.glob("*_norm.parquet")], "exists": 1}
        )
        return list(
            self.files_in_scope.merge(
                current,
                how="left",
                on="filename",
            )
            .pipe(lambda df: df[df["exists"].isnull()])
            .drop(columns="exists")
            .itertuples()
        )

    def _add_filenames(self):
        """
        Add to the DataFrame of input files the expected name of the normalized file.
        """
        all_files = list(self.files_in_scope.itertuples(index=False))
        fns = [str(self.dataset_filename(file, "norm")) for file in all_files]
        self.files_in_scope = self.files_in_scope.assign(filename=fns)

    def _concatenate_files(self):
        """
        Concatenate all the normalized files which have succeeded into a single parquet file.
        This step is made in polars as the sum of all dataset by be heavy on memory.
        """
        all_files = list(self.data_folder.glob("*_norm.parquet"))
        LOGGER.info(f"Concatenating {len(all_files)} files for {str(self)}")
        dfs = [pl.scan_parquet(f) for f in all_files]
        df = pl.concat(dfs, how="diagonal_relaxed")
        df.sink_parquet(self.combined_filename)

    @property
    def aggregated_dataset(self):
        """
        Property to return the aggregated dataset.
        """
        if not self.combined_filename.exists():
            raise RuntimeError("Combined file does not exists. You must run .load() first.")
        return pd.read_parquet(self.combined_filename)
