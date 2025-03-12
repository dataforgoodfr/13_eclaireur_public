import hashlib
import json
import logging
import ssl
import urllib
import urllib.request
from collections import Counter, defaultdict
from urllib.error import HTTPError

import pandas as pd
import polars as pl
from tqdm import tqdm

from back.scripts.datasets.constants import (
    TOPIC_COLUMNS_NORMALIZATION_REGEX,
    TOPIC_IGNORE_EXTRA_COLUMNS,
)
from back.scripts.loaders import LOADER_CLASSES
from back.scripts.loaders.json_loader import JSONLoader
from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.dataframe_operation import (
    merge_duplicate_columns,
    normalize_column_names,
    normalize_identifiant,
    normalize_montant,
    safe_rename,
)

ssl._create_default_https_context = ssl._create_unverified_context

LOGGER = logging.getLogger(__name__)


def _sha256(s):
    return None if pd.isna(s) else hashlib.sha256(s.encode("utf-8")).hexdigest()


class TopicAggregator:
    """
    This class is responsible for loading the datafiles from the files_in_scope dataframe.
    It loads the schema of the topic, filters the readable files, loads the datafiles into dataframes, and normalizes the data according to the schema.
    The main difference with DataFilesLoader is that it loads, saves and normalizes each dataset independently.
    Each step (download, load, normalize) generates a local file that must be saved.
    A given step on a given file must not be run if the output file already exists on disk.
    """

    def __init__(
        self,
        files_in_scope: pd.DataFrame,
        topic: str,
        topic_config: dict,
        datafile_loader_config: dict,
    ):
        self.files_in_scope = files_in_scope.assign(
            url_hash=lambda df: df["url"].apply(_sha256)
        )
        self.topic = topic
        self.topic_config = topic_config
        self.datafile_loader_config = datafile_loader_config

        self.corpus: list = []
        self.datafiles_out: list = []

        self.data_folder = get_project_base_path() / (
            self.datafile_loader_config["data_folder"] % {"topic": topic}
        )
        self.data_folder.mkdir(parents=True, exist_ok=True)
        self.combined_filename = get_project_base_path() / (
            self.datafile_loader_config["combined_filename"] % {"topic": topic}
        )
        self.extra_columns = Counter()

        self._load_schema(topic_config["schema"])
        self._load_manual_column_rename()
        self._add_filenames()
        self.errors = defaultdict(list)

    def _load_schema(self, schema_topic_config):
        """
        Load a Dataframe in memory containing official columns conventions.
        """
        schema_filename = self.data_folder / f"official_schema_{self.topic}.parquet"
        if schema_filename.exists():
            self.official_topic_schema = pd.read_parquet(schema_filename)
            return
        json_schema_loader = JSONLoader(schema_topic_config["url"], key="fields")
        schema_df = json_schema_loader.load()
        LOGGER.info("Schema loaded.")
        extra_concepts = [
            {
                "name": "categoryUsage",
                "title": "Role de la subventio (investissement / fonctionnement)",
            }
        ]
        self.official_topic_schema = pd.concat(
            [schema_df, pd.DataFrame(extra_concepts)], ignore_index=True
        ).assign(lower_name=lambda df: df["name"].str.lower())
        self.official_topic_schema.to_parquet(schema_filename)

    def _load_manual_column_rename(self):
        """
        Load a manually defiend mapping between the original column name and an official column name.
        """
        schema_dict_file = get_project_base_path() / self.topic_config["schema_dict_file"]
        self.manual_column_rename = (
            pd.read_csv(schema_dict_file, sep=";")
            .set_index("original_name")["official_name"]
            .to_dict()
        )

    def run(self) -> None:
        for file_metadata in tqdm(self._files_to_run()):
            if file_metadata.format not in LOADER_CLASSES:
                LOGGER.warning(f"Format {file_metadata.format} not supported")
                continue

            if file_metadata.url is None or pd.isna(file_metadata.url):
                LOGGER.warning(f"URL not specified for file {file_metadata.title}")
                continue

            self._treat_datafile(file_metadata)

        self._concatenate_files()
        with open(self.data_folder / "errors.json", "w") as f:
            json.dump(self.errors, f)
        return self

    def _add_filenames(self):
        """
        Add to the DataFrame of input files the expected name of the normalized file.
        """
        all_files = list(self.files_in_scope.itertuples(index=False))
        fns = [str(self.dataset_filename(file, "norm")) for file in all_files]
        self.files_in_scope = self.files_in_scope.assign(filename=fns)

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

    def _treat_datafile(self, file_metadata: tuple) -> None:
        """
        Download and normalize a spécific file.
        """
        self._download_file(file_metadata)
        self._normalize_data(file_metadata)

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

    def dataset_filename(self, file_metadata: tuple, step: str):
        """
        Expected path for a given file depending on the step (raw or norm).
        """
        return (
            self.data_folder
            / f"{self.topic}_{file_metadata.url_hash}_{step}.{file_metadata.format if step == 'raw' else 'parquet'}"
        )

    def _normalize_data(self, file_metadata: tuple) -> pd.DataFrame:
        """
        Read a saved raw dataset and transform its columns and type
        to fit into the official schema.

        Automatically load a dataset into a pandas dataframe, whatever the initial format.
        A mixture of explicit matching and keyword matching identify the columns of interest
        and adapt their name.
        Ensure the correct data type.

        If the process raises an exception, the file is skipped, a message is logged,
        and the error is added to the errors.csv tracking file.
        """
        out_filename = self.dataset_filename(file_metadata, "norm")
        if out_filename.exists():
            LOGGER.debug(f"File {out_filename} already exists, skipping")
            return

        raw_filename = self.dataset_filename(file_metadata, "raw")
        if not raw_filename.exists():
            LOGGER.debug(f"File {raw_filename} does not exist, skipping")
            return
        opts = {"dtype": str} if file_metadata.format == "csv" else {}
        loader = LOADER_CLASSES[file_metadata.format](raw_filename, **opts)
        try:
            df = loader.load()
            if not isinstance(df, pd.DataFrame):
                LOGGER.error(f"Unable to load file into a DataFrame = {file_metadata.url}")
                raise RuntimeError("Unable to load file into a DataFrame")
            df = df.pipe(self._normalize_frame, file_metadata)
            df.to_parquet(out_filename)
        except Exception as e:
            self.errors[str(e)].append(raw_filename.name)
            return

    def _flag_extra_columns(self, df: pd.DataFrame, file_metadata: tuple):
        """
        Identify in the dataset columns that are neither in the official schema
        nor in the list of columns to ignore.
        If such columns exists, the normalization process must fail for this file
        and those columns are logged to allow further analysis.
        """
        extra_columns = (
            set(df.columns)
            - set(self.official_topic_schema["name"])
            - set(TOPIC_IGNORE_EXTRA_COLUMNS)
        )
        if not extra_columns:
            return

        self.extra_columns.update(extra_columns)
        LOGGER.warning(f"File {file_metadata.url} has extra columns: {extra_columns}")
        raise RuntimeError("File has extra columns")

    def _normalize_frame(self, df: pd.DataFrame, file_metadata: tuple):
        """
        Set of steps to transform a raw DataFrame into a normalized one.
        """
        df = (
            df.pipe(normalize_column_names)
            .pipe(merge_duplicate_columns)
            .pipe(safe_rename, self.manual_column_rename)
            .rename(
                columns=self.official_topic_schema.set_index("lower_name")["name"].to_dict()
            )
            .pipe(self._flag_columns_by_keyword)
            .pipe(normalize_identifiant, "idBeneficiaire")
            .pipe(normalize_identifiant, "idAttribuant")
            .pipe(normalize_montant, "montant")
        )
        self._flag_inversion_siret(df, file_metadata)
        self._flag_extra_columns(df, file_metadata)
        return df.pipe(self._select_official_columns).pipe(self._add_metadata, file_metadata)

    def _add_metadata(self, df: pd.DataFrame, file_metadata: tuple):
        """
        Add to the normalized dataframe infos about the source of the raw file.
        """
        optional_features = {}
        if "idAttribuant" not in df.columns:
            optional_features["idAttribuant"] = str(file_metadata.siren).zfill(9) + "0" * 5
        return df.assign(
            topic=self.topic,
            url=file_metadata.url,
            coll_type=file_metadata.type,
            **optional_features,
        )

    def _select_official_columns(self, frame: pd.DataFrame) -> pd.DataFrame:
        """
        Select from the dataframe the columns that are in the official schema.
        """
        columns = [x for x in self.official_topic_schema["name"] if x in frame.columns]
        return frame[columns]

    def _flag_inversion_siret(self, df: pd.DataFrame, file_metadata: tuple):
        """
        Flag datasets which have more unique attribuant siret than beneficiaire
        """
        if "idAttribuant" not in df.columns or "idBeneficiaire" not in df.columns:
            return
        n_attribuant = (
            df["idAttribuant"].str[:9].nunique() if "idAttribuant" in df.columns else 0
        )
        n_beneficiaire = df["idBeneficiaire"].str[:9].nunique()
        if n_attribuant < n_beneficiaire:
            return
        LOGGER.error(
            f"Data with more unique attribuant siret than beneficiaire : {file_metadata.url}"
        )
        raise RuntimeError("Data with more unique attribuant siret than beneficiaire")

    def _flag_columns_by_keyword(self, frame: pd.DataFrame) -> pd.DataFrame:
        """
        Identify columns that may correspond to the one in the official schema based on regex.
        Ensure that this process may not create a duplicate of a column.
        """
        extra_colums = set(frame.columns) - set(self.official_topic_schema["name"])
        matching = {}
        for col in extra_colums:
            options = {
                v
                for k, v in TOPIC_COLUMNS_NORMALIZATION_REGEX.items()
                if k.search(col.lower()) and v not in frame.columns
            }
            if len(options) == 1:
                matching[col] = list(options)[0]
        return frame.rename(columns=matching)

    def _concatenate_files(self):
        """
        Concatenate all the normalized files which have succeeded into a single parquet file.
        This step is made in polars as the sum of all dataset by be heavy on memory.
        """
        all_files = list(self.data_folder.glob("*_norm.parquet"))
        LOGGER.info(f"Concatenating {len(all_files)} files for topic {self.topic}")
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
