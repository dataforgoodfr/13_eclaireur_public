import copy
import logging
import re
import ssl
from collections import Counter
from pathlib import Path

import pandas as pd
from inflection import underscore as to_snake_case

from back.scripts.datasets.constants import (
    TOPIC_COLUMNS_NORMALIZATION_REGEX,
    TOPIC_IGNORE_EXTRA_COLUMNS,
    TOPIC_IGNORE_EXTRA_REGEX,
)
from back.scripts.datasets.dataset_aggregator import DatasetAggregator
from back.scripts.loaders.json_loader import JSONLoader
from back.scripts.utils.config import get_project_base_path, project_config
from back.scripts.utils.dataframe_operation import (
    merge_duplicate_columns,
    normalize_column_names,
    normalize_date,
    normalize_identifiant,
    normalize_montant,
    safe_rename,
)
from back.scripts.utils.typing import PandasRow

ssl._create_default_https_context = ssl._create_unverified_context

LOGGER = logging.getLogger(__name__)


class TopicAggregator(DatasetAggregator):
    """
    This class is responsible for loading and normalizing the subvention files.

    As a DatasetAggregator subclass, each subvention candidate is downloaded and formatted individually.
    All properly normalized files are concatenate in the end.

    Given the wide variety of file formats, there are multiple steps to try to identify the columns of interest
    and properly format them.
    Files that are not properly read or formatted are logged into the errors.json file with the corresponding error.
    """

    def __init__(
        self,
        files_in_scope: pd.DataFrame,
        topic: str,
        datafile_loader_config: dict,
    ):
        self.topic = topic
        self.topic_config = project_config["search"][topic]

        super().__init__(files_in_scope, self.substitute_config(topic, datafile_loader_config))

        self._load_schema(self.topic_config["schema"])
        self._load_manual_column_rename()
        self.extra_columns = Counter()
        self.missing_data = []

    @classmethod
    def get_config_key(cls):
        return "topic_aggregator"

    @classmethod
    def substitute_config(cls, topic: str, datafile_loader_config: dict) -> dict:
        datafile_loader_config = copy.deepcopy(datafile_loader_config)
        formatting = {"topic": topic}
        datafile_loader_config["data_folder"] = (
            datafile_loader_config["data_folder"] % formatting
        )
        datafile_loader_config["combined_filename"] = (
            datafile_loader_config["combined_filename"] % formatting
        )
        return {cls.get_config_key(): datafile_loader_config}

    @classmethod
    # default value is a hack until we rename and simplify topic aggregator, as it's always processing subventions
    def get_output_path(cls, main_config: dict, topic: str = "subventions") -> Path:
        return Path(main_config[cls.get_config_key()]["combined_filename"] % {"topic": topic})

    def _post_process(self) -> None:
        pd.DataFrame.from_dict(self.extra_columns, orient="index").to_csv(
            self.data_folder / "extra_columns.csv"
        )
        pd.DataFrame.from_records(self.missing_data).to_parquet(
            self.data_folder / "missing_data.parquet"
        )

    def _load_schema(self, schema_topic_config: dict) -> None:
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

    def _load_manual_column_rename(self) -> None:
        """
        Load a manually defiend mapping between the original column name and an official column name.
        """
        schema_dict_file = get_project_base_path() / self.topic_config["schema_dict_file"]
        self.manual_column_rename = (
            pd.read_csv(schema_dict_file, sep=";")
            .set_index("original_name")["official_name"]
            .to_dict()
        )

    def _flag_extra_columns(self, df: pd.DataFrame, file_metadata: PandasRow) -> None:
        """
        Identify in the dataset columns that are neither in the official schema
        nor in the list of columns to ignore.
        If such columns exists, the normalization process must fail for this file
        and those columns are logged to allow further analysis.
        """
        regex_ignore = [
            c for c in df.columns if any([pat.match(c) for pat in TOPIC_IGNORE_EXTRA_REGEX])
        ]
        extra_columns = (
            set(df.columns)
            - set(self.official_topic_schema["name"])
            - set(TOPIC_IGNORE_EXTRA_COLUMNS + regex_ignore)
        )
        if not extra_columns:
            return

        self.extra_columns.update(extra_columns)
        LOGGER.warning(f"File {file_metadata.url} has extra columns: {extra_columns}")
        raise RuntimeError("File has extra columns")

    def _normalize_frame(self, df: pd.DataFrame, file_metadata: PandasRow) -> pd.DataFrame:
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
        )
        self._flag_duplicate_columns(df, file_metadata)
        df = (
            df.pipe(normalize_identifiant, "idBeneficiaire")
            .pipe(normalize_identifiant, "idAttribuant")
            .pipe(normalize_montant, "montant")
            .pipe(normalize_date, "dateConvention")
        )
        self._flag_inversion_siret(df, file_metadata)
        self._flag_extra_columns(df, file_metadata)
        return (
            df.pipe(self._select_official_columns)
            .pipe(self._add_metadata, file_metadata)
            .pipe(self._clean_missing_values, file_metadata)
            .rename(columns=to_snake_case)
        )

    def _add_metadata(self, df: pd.DataFrame, file_metadata: PandasRow) -> pd.DataFrame:
        """
        Add to the normalized dataframe infos about the source of the raw file.
        """
        optional_features = {}
        if "idAttribuant" not in df.columns:
            optional_features["idAttribuant"] = str(file_metadata.siren).zfill(9) + "0" * 5

        if "dateConvention" not in df.columns:
            df = self._add_date_from_metadata(df, file_metadata)

        if "dateConvention" in df.columns:
            optional_features["annee"] = df["dateConvention"].dt.year
        return df.assign(
            topic=self.topic,
            url=file_metadata.url,
            coll_type=file_metadata.type,
            **optional_features,
        )

    def _clean_missing_values(self, df: pd.DataFrame, file_metadata: PandasRow) -> pd.DataFrame:
        """
        Clean the dataframe by removing rows where all values are missing.
        """
        must_have_columns = ["montant", "annee", "idAttribuant", "idBeneficiaire"]
        missings = sorted(set(must_have_columns) - set(df.columns))
        if missings:
            self.missing_data.append(
                {
                    "url_hash": file_metadata.url_hash,
                    "missing_rate": 1.0,
                    "reason": "missing_columns",
                    "missing_columns": ",".join(missings),
                }
            )
            raise RuntimeError("Missing columns : " + ",".join(missings))

        missings = df[must_have_columns].isna()
        mask = missings.any(axis=1)
        missing_rate = mask.sum() / len(mask)
        if missing_rate > 0:
            missings = sorted(missings.sum().pipe(lambda s: s[s > 0]).index.values)
            self.missing_data.append(
                {
                    "url_hash": file_metadata.url_hash,
                    "missing_rate": missing_rate,
                    "reason": "missing_values",
                    "missing_columns": ",".join(missings),
                }
            )
        return df[~mask]

    @staticmethod
    def _flag_duplicate_columns(df: pd.DataFrame, file_metadata: PandasRow) -> None:
        if len(df.columns) != len(set(df.columns)):
            LOGGER.error(f"Data with duplicate columns : {file_metadata.url_hash}")
            raise RuntimeError("Data with duplicate columns")

    def _select_official_columns(self, frame: pd.DataFrame) -> pd.DataFrame:
        """
        Select from the dataframe the columns that are in the official schema.
        """
        columns = [x for x in self.official_topic_schema["name"] if x in frame.columns]
        return frame[columns]

    @staticmethod
    def _flag_inversion_siret(df: pd.DataFrame, file_metadata: PandasRow) -> None:
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

    def _add_date_from_metadata(
        self, df: pd.DataFrame, file_metadata: PandasRow
    ) -> pd.DataFrame:
        metadata_year = self.year_from_metadata(file_metadata)
        if metadata_year:
            return df.assign(
                dateConvention=pd.to_datetime(metadata_year, format="%Y", utc=True)
            )
        return df

    @staticmethod
    def year_from_metadata(file_metadata: PandasRow) -> str | None:
        pat = re.compile(r"\b(20\d{2})\b")

        title = file_metadata.dataset_title or ""
        title_year = pat.search(title.replace("_", " "))
        if title_year and len(title_year.groups()) == 1:
            return title_year.group(1)

        title = file_metadata.title or ""
        title_year = pat.search(title.replace("_", " "))
        if title_year and len(title_year.groups()) == 1:
            return title_year.group(1)

        return None
