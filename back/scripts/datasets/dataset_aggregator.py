import hashlib
import json
import logging
import urllib.request
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import IO
from urllib.error import HTTPError

import pandas as pd
import polars as pl
from tqdm import tqdm

from back.scripts.datasets.utils import BaseDataset
from back.scripts.loaders import BaseLoader
from back.scripts.utils.dataframe_operation import merge_cols_into_one
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


def _sha1(f: IO[bytes] | None) -> str | None:
    """
    Compute SHA1 hash from a local filestream.
    Purpose: compare with hash provide by gouvdata_catalog.

    Args:
        f (file | None): file stream.
    Returns:
        s (str | None): hexadecimal SHA1 hash of file stream's content, or None.
    """
    return hashlib.file_digest(f, "sha1").hexdigest()


def _file_sha1(p: Path | None) -> str | None:
    """
    Compute SHA1 hash from a local path.
    Purpose: compare with hash provide by gouvdata_catalog.

    Args:
        p (Path | None): existing Path.
    Returns:
        s (str | None): hexadecimal SHA1 hash of the content of the file references by path, or None if not exists.
    """
    if not p.exists():
        return None
    with open(p, "rb") as f:
        return _sha1(f)


def _file_mtime(p: Path | None) -> datetime | None:
    """
    return the last modification date of a file as datetime
    """
    if not p.exists():
        return None
    stat_result = p.stat()
    return datetime.fromtimestamp(stat_result.st_mtime)


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
        """
        Process all files, if at least one is modified, update ouput_file
        """
        if self._process_files():
            self._post_process()
            self._concatenate_files()
            with open(self.data_folder / "errors.json", "w") as f:
                json.dump(self.errors, f)

    def _process_files(self) -> bool:
        """
        Process all files in scope.
        For each one, download if remote is different (sha1 checks) then process normalization if new/updated
        Return True if at least one file was updated to force concatenation
        """

        # force to process the complete pipeline if the result not exists.
        need_rebuild_output = not self.output_filename.exists()
        for file_infos in tqdm(self._remaining_to_normalize()):
            if not file_infos.need_download and not file_infos.need_normalize:
                LOGGER.debug(
                    f"[{self.get_config_key()}]: {file_infos.url} is skipped (checksum || mtime)"
                )
                continue

            if file_infos.url is None or pd.isna(file_infos.url):
                LOGGER.warning(f"URL not specified for file {file_infos.title}")
                continue

            try:
                self._process_file(file_infos)
                need_rebuild_output = True
            except Exception as e:
                LOGGER.warning(f"Failed to process file {file_infos.url}: {e}")
                self.errors[str(e)].append(file_infos.url)

        return need_rebuild_output

    def _post_process(self) -> None:
        pass

    def _process_file(self, file_metadata: PandasRow) -> None:
        """
        Download a specific file if different.
        Normalize it if needed (non existant normalized file, or updated source)
        """
        if file_metadata.need_download:
            self._download_file(file_metadata)
        if file_metadata.need_normalize:
            self._normalize_file(file_metadata)

    def _download_file(self, file_metadata: PandasRow) -> None:
        """
        Save locally the output of the URL.
        """
        output_filename = self._dataset_filename(file_metadata, "raw")
        output_filename.parent.mkdir(exist_ok=True, parents=True)
        try:
            urllib.request.urlretrieve(file_metadata.url, output_filename)
            LOGGER.info(f"Downloaded file {file_metadata.url}")

        except HTTPError as error:
            LOGGER.warning(f"Failed to download file {file_metadata.url}: {error}")
            msg = f"HTTP error {error.code}"
            self.errors[msg].append(file_metadata.url)
        except Exception as e:
            LOGGER.warning(f"Failed to download file {file_metadata.url}: {e}")
            self.errors[str(e)].append(file_metadata.url)

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
        """
        process specific and independent steps on file.
        only call if source file is new or has changed.
        """
        out_filename = self._dataset_filename(file_metadata, "norm")
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

        def print_df(df: pd.DataFrame):
            cols_to_query = [
                "base_url",
                "url_hash",
                "checksum_value",
                "extras_analysis:checksum",
                "need_download",
                "need_normalize",
                "extras_analysis:last-modified-at",
                "modified",
                "last-modified",
                "internal_last_modified",
            ]
            existing_cols = []
            for ctq in cols_to_query:
                if ctq in df:
                    existing_cols.append(ctq)

            print(df[existing_cols])
            return df

        download_all = self.main_config["workflow"]["download_all"]
        normalize_all = self.main_config["workflow"]["normalize_all"]

        # Cas simple, on télécharge tout, on ajoute les deux attributs (valorisés à True) qui servent à la suite des opérations, et on s'en va.
        if download_all:
            LOGGER.debug(
                f"[{self.get_config_key()}] force download turn on: {self.files_in_scope.shape[0]} files planned to download"
            )
            return list(
                self.files_in_scope.assign(need_download=True, need_normalize=True).itertuples()
            )

        # Etat de la situation, liste des fichiers sources avec leur date respective et leur somme de contrôle.
        current = pd.DataFrame(
            [
                {
                    "url_hash": str(x.parent.name),
                    "local_hash": _file_sha1(x),
                    "local_mtime": _file_mtime(x),
                }
                for x in self.data_folder.glob("*/raw.*")
            ],
            columns=["url_hash", "local_hash", "local_mtime"],
        )

        # On associe à chaque fichier à DL au fichier local si il existe.
        file_to_process = (
            self.files_in_scope.merge(
                current,
                how="left",
                on="url_hash",
            )
            # On ajoute les deux attributs qui servent à la suite des opérations.
            .assign(
                need_download=False,
                need_normalize=False,
                url_hash=lambda df: df["url_hash"].astype(str).where(df["url_hash"].notnull())
                if "url_hash" in df
                else None,
                local_hash=lambda df: df["local_hash"]
                .astype(str)
                .where(df["local_hash"].notnull()),
            )
            .pipe(print_df)
            # on met les sommes de contrôle répartis sur plusieurs attributs sur le premier ("checksum_value") pour nous faciliter la vie après
            .pipe(
                merge_cols_into_one,
                ["checksum_value", "analysis:checksum", "extras_analysis:checksum"],
            )
            # on met les dates de dernières modifications répartis sur plusieurs attributs sur un nouveau ("last-modified") pour nous faciliter la vie après
            .pipe(
                merge_cols_into_one,
                ["last_update", "modified", "extras_analysis:last-modified-at"],
                target_col="last-modified",
                astype="datetime64[ns]",
            )
            .pipe(print_df)
            # on calcule la nécessité de télécharger le fichier
            .assign(
                need_download=lambda s: s["local_hash"] != s["checksum_value"]
                if "checksum_value" in s
                else s["last_update"] > s["local_mtime"]
                if "last_update" in s
                else True
            )
            # on calcule la nécessité de traiter le fichier.
            .assign(need_normalize=lambda s: normalize_all or s["need_download"])
            .drop(columns=["local_mtime", "local_hash", "last-modified"], errors='ignore')
        )

        total_files = file_to_process.shape[0]
        download_planned = file_to_process[file_to_process["need_download"]].shape[0]
        normalization_planned = file_to_process[file_to_process["need_normalize"]].shape[0]
        LOGGER.info(
            f"[{self.get_config_key()}] (pool size : {total_files}) {download_planned} files planned to download / {normalization_planned} files planned to normalization"
        )

        return list(file_to_process.itertuples())

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
