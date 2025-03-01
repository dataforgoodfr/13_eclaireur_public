import hashlib
import logging
import re
import urllib
import urllib.request
from collections import Counter
from typing import Tuple

import pandas as pd
import polars as pl
from scripts.loaders.csv_loader import CSVLoader
from scripts.loaders.excel_loader import ExcelLoader
from scripts.loaders.json_loader import JSONLoader
from scripts.utils.config import get_project_base_path
from scripts.utils.dataframe_operation import (
    cast_data,
    merge_duplicate_columns,
    normalize_column_names,
    normalize_identifiant,
    safe_rename,
)
from tqdm import tqdm

LOGGER = logging.getLogger(__name__)

LOADER_CLASSES = {
    "csv": CSVLoader,
    "xls": ExcelLoader,
    "xlsx": ExcelLoader,
    "excel": ExcelLoader,
    "json": JSONLoader,
}

COLUMNS_KEYWORDS = {
    r"(raison_sociale)": "nomBeneficiaire",
    "(montant|euros)": "montant",
    "collectivite": "nomAttribuant",
    "(sire[nt])": "idBeneficiaire",
    "nom[_ ].*attribu(ant|taire)": "nomAttribuant",
    "nom[_ ].*(beneficiaire|association)": "nomBeneficiaire",
    "association[_ ].*nom": "nomBeneficiaire",
    "id(entification)?[_ ].*attribu(ant|taire)": "idAttribuant",
    "id(entification)?[_ ].*beneficiaire": "idBeneficiaire",
    "nature": "nature",
    "date.*(convention|deliberation)": "dateConvention",
    "ann[éez_]e": "dateConvention",
    "pourcentage": "pourcentageSubvention",
    "notif(ication)?.*[_ ]ue": "notificationUE",
    "(date|periode).*versement": "datesPeriodeVersement",
    "condition": "conditionsVersement",
    "(description|objet).*(dossier)?": "objet",
    "subvention.*accord": "montant",
    "numero.*dossier": "referenceDecision",
    "reference.*(deliberation|decision)": "referenceDecision",
}

NEGLECT_EXTRA_COLUMNS = [
    "domaine",
    "sous_domaine",
    "secteur",
    "sous_secteur",
    "association_code",
    "unknown",
    "objet_1",
    "objet_2",
    "secteurs d'activités définies par l'association",
    "direction",
    "code_tranche",
    "cscollnom",
    "cscollsiret",
    "csmodificationdate",
    "attrib_type",
    "coll_type",
    "sub_date_debut",
    "sub_date_fin",
    "sub_dispositif",
    "siege",
    "intdomaine_id",
]


def sha256(s: str):
    return hashlib.sha256(s.encode("utf-8")).hexdigest() if s else None


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
        self.files_in_scope = files_in_scope.assign(url_hash=lambda df: df["url"].apply(sha256))
        self.topic = topic
        self.topic_config = topic_config
        self.datafile_loader_config = datafile_loader_config

        self.corpus: list = []
        self.datafiles_out: list = []

        self.data_folder = get_project_base_path() / (
            self.datafile_loader_config["data_folder"] % {"topic": topic}
        )
        self.data_folder.mkdir(parents=True, exist_ok=True)
        self.extra_columns = Counter()

        self._load_schema(topic_config["schema"])
        self._load_manual_column_rename()
        self._add_filenames()

    def _load_schema(self, schema_topic_config):
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
        print(self.official_topic_schema)

    def _load_manual_column_rename(self):
        schema_dict_file = get_project_base_path() / self.topic_config["schema_dict_file"]
        self.manual_column_rename = (
            pd.read_csv(schema_dict_file, sep=";")
            .set_index("original_name")["official_name"]
            .to_dict()
        )

    def run(self) -> None:
        for file_infos in tqdm(self._files_to_run()):
            if file_infos.format not in LOADER_CLASSES:
                LOGGER.warning(f"Format {file_infos.format} not supported")
                continue

            if file_infos.url is None or pd.isna(file_infos.url):
                LOGGER.warning(f"URL not specified for file {file_infos.name}")
                continue

            self._treat_datafile(file_infos)

        self._combine_files()

    def _add_filenames(self):
        all_files = list(self.files_in_scope.itertuples(index=False))
        fns = [str(self.dataset_filename(file, "norm")) for file in all_files]
        self.files_in_scope = self.files_in_scope.assign(filename=fns)

    def _files_to_run(self):
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

    def _treat_datafile(self, file: Tuple) -> None:
        self._download_file(file)
        self._normalize_data(file)

    def _download_file(self, file_info: dict):
        output_filename = self.dataset_filename(file_info, "raw")
        if output_filename.exists():
            LOGGER.debug(f"File {output_filename} already exists, skipping")

        try:
            urllib.request.urlretrieve(file_info.url, output_filename)
        except Exception as e:
            LOGGER.warning(f"Failed to download file {file_info.url}: {e}")

    def dataset_filename(self, file: Tuple, step: str):
        return (
            self.data_folder
            / f"{self.topic}_{file.url_hash}_{step}.{file.format if step == 'raw' else 'parquet'}"
        )

    def _normalize_data(self, file: Tuple) -> pd.DataFrame:
        skip = [
            "https://data.ampmetropole.fr/api/explore/v2.1/catalog/datasets/fr-orthophoto-mamp-2022/exports/csv?use_labels=true"
        ]
        raw_filename = self.dataset_filename(file, "raw")
        if not raw_filename.exists() or file.url in skip:
            return
        if file.format != "csv":
            return

        out_filename = self.dataset_filename(file, "norm")
        if out_filename.exists():
            LOGGER.debug(f"File {out_filename} already exists, skipping")

        opts = {"dtype": str} if file.format == "csv" else {}
        loader = LOADER_CLASSES[file.format](file.url, **opts)
        try:
            df = loader.load().pipe(self._normalize_frame, file)
            df.to_parquet(out_filename)
        except Exception as e:
            print(e)
            return

    def _flag_extra_columns(self, df: pd.DataFrame, file: Tuple):
        extra_columns = (
            set(df.columns)
            - set(self.official_topic_schema["name"])
            - set(NEGLECT_EXTRA_COLUMNS)
        )
        if not extra_columns:
            return

        self.extra_columns.update(extra_columns)
        LOGGER.warning(f"File {file.url} has extra columns: {extra_columns}")
        raise RuntimeError("File has extra columns")

    def _normalize_frame(self, df: pd.DataFrame, file: Tuple):
        df = (
            df.pipe(normalize_column_names)
            .pipe(merge_duplicate_columns)
            # .pipe(_print, "post merge")
            .pipe(safe_rename, self.manual_column_rename)
            # .pipe(_print, "post rename")
            .rename(
                columns=self.official_topic_schema.set_index("lower_name")["name"].to_dict()
            )
            # .pipe(_print, "post official")
            .pipe(self._flag_columns_by_keyword)
            # .pipe(_print, "post keyword")
            .pipe(normalize_identifiant, "idBeneficiaire")
            .pipe(normalize_identifiant, "idAttribuant")
        )
        self._flag_inversion_siret(df, file)
        self._flag_extra_columns(df, file)
        return self._add_metadata(df, file)

    def _add_metadata(self, df: pd.DataFrame, file: Tuple):
        optional_features = {}
        if "idAttribuant" not in df.columns:
            optional_features["idAttribuant"] = str(file.siren).zfill(9) + "0" * 5
        return df.assign(
            topic=self.topic, url=file.url, coll_type=file.type, **optional_features
        )

    def _flag_inversion_siret(self, df: pd.DataFrame, file: Tuple):
        """
        Flag datasets which have more unique attribuant sire    t than beneficiaire
        """
        if "idAttribuant" not in df.columns or "idBeneficiaire" not in df.columns:
            return
        n_attribuant = (
            df["idAttribuant"].str[:9].nunique() if "idAttribuant" in df.columns else 0
        )
        n_beneficiaire = df["idBeneficiaire"].str[:9].nunique()
        if n_attribuant < n_beneficiaire:
            return
        LOGGER.error(f"Data with more unique attribuant siret than beneficiaire : {file.url}")
        raise RuntimeError("Data with more unique attribuant siret than beneficiaire")

    def _flag_columns_by_keyword(self, frame: pd.DataFrame) -> pd.DataFrame:
        extra_colums = set(frame.columns) - set(self.official_topic_schema["name"])
        matching = {}
        for col in extra_colums:
            options = {
                v
                for k, v in COLUMNS_KEYWORDS.items()
                if re.search(k, col.lower()) and v not in frame.columns
            }
            if len(options) == 1:
                matching[col] = list(options)[0]
        return frame.rename(columns=matching)

    def _combine_files(self):
        all_files = list(self.data_folder.glob("*_norm.parquet"))
        LOGGER.info(f"Concatenating {len(all_files)} files for topic {self.topic}")
        dfs = [pl.scan_parquet(f) for f in all_files]
        df = pl.concat(dfs, how="diagonal_relaxed")
        df.sink_parquet(self.data_folder / f"{self.topic}_final.parquet")


class DatafilesLoader:
    """
    This class is responsible for loading the datafiles from the files_in_scope dataframe.
    It loads the schema of the topic, filters the readable files, loads the datafiles into dataframes, and normalizes the data according to the schema.
    TODO: Everything is done in the __init__ method, it should be refactored to be more readable and maintainable (or using external libraries).
    """

    def __init__(self, files_in_scope, topic, topic_config, datafile_loader_config):
        self.logger = logging.getLogger(__name__)

        self.loader_classes = {
            "csv": CSVLoader,
            "xls": ExcelLoader,
            "xlsx": ExcelLoader,
            "excel": ExcelLoader,
            "json": JSONLoader,
        }

        # Load filtered datafiles list to explore
        self.files_in_scope = files_in_scope
        # Load normalized data output schema
        self.schema = self._load_schema(topic_config["schema"])
        # Separate readable and unreadable files based on their format
        self.datafiles_out = pd.DataFrame()
        readable_files, self.datafiles_out = self._keep_readable_datafiles()
        # Load the readable files into dataframes
        self.corpus = self._load_datafiles(readable_files, datafile_loader_config)
        # Normalize the loaded data according to the defined schema
        self.normalized_data, self.datacolumns_out = self._normalize_data(
            topic, topic_config, datafile_loader_config
        )
        self.normalized_data.to_csv("normalized.csv")
        self.normalized_data.to_parquet("normalized.parquet")

    # Internal function to load the offical schema of the topic normalized data
    def _load_schema(self, schema_topic_config):
        json_schema_loader = JSONLoader(schema_topic_config["url"], key="fields")
        schema_df = json_schema_loader.load()
        self.logger.info("Schema loaded.")
        return schema_df

    # Internal function to keep only the readable files
    def _keep_readable_datafiles(self):
        preferred_formats = [
            "csv",
            "xls",
            "xlsx",
            "json",
            "zip",
        ]  # TODO: Preferred formats should be defined in the config

        readable_files = self.files_in_scope[
            self.files_in_scope["format"].isin(preferred_formats)
        ]
        datafiles_out = self.files_in_scope[
            ~self.files_in_scope["format"].isin(preferred_formats)
        ]
        self.logger.info(f"{len(readable_files)} readable files selected.")
        return readable_files, datafiles_out

    # Internal function to load the data from a single file, depending on its format
    def _load_file_data(self, file_info, datafile_loader_config):
        loader_class = self.loader_classes.get(file_info["format"].lower())
        if loader_class:
            loader = loader_class(file_info["url"])
            try:
                df = loader.load()
                if not df.empty:
                    for col in datafile_loader_config["file_info_columns"]:
                        if col in file_info:
                            df[col] = file_info[col]
                    self.logger.info(f"Data from {file_info['url']} loaded.")
                    return df
            except Exception as e:
                self.logger.error(f"Failed to load data from {file_info['url']} - {e}")
        else:
            self.logger.warning(f"Loader not found for format {file_info['format']}")

        # Add the file to the list of files that could not be loaded
        file_info_df = pd.DataFrame(file_info).transpose()
        self.datafiles_out = pd.concat([self.datafiles_out, file_info_df], ignore_index=True)
        return None

    # Internal function to load the datafiles into a dataframes list
    def _load_datafiles(self, readable_files, datafile_loader_config):
        len_out = len(self.datafiles_out)
        data = []

        for _, file_info in readable_files.iterrows():
            df = self._load_file_data(file_info, datafile_loader_config)
            if df is not None:
                data.append(df)

        self.logger.info("Number of dataframes loaded: %s", len(data))
        self.logger.info(
            "Number of elements in data that are not dataframes: %s",
            sum([not isinstance(df, pd.DataFrame) for df in data]),
        )
        self.logger.info("Number of files not loaded: %s", len(self.datafiles_out) - len_out)

        return data

    # Internal function to normalize the loaded data according to the defined schema
    # TODO: This function should be refactored to be more readable and maintainable (or using external libraries)
    def _normalize_data(self, topic, topic_config, datafile_loader_config):
        len_out = len(
            self.datafiles_out
        )  # used to count the number of files not normalized during the process
        file_info_columns = datafile_loader_config[
            "file_info_columns"
        ]  # additional columns to add to the official schema (e.g. siren, url, source, etc.)
        normalized_data = pd.DataFrame(
            columns=self.schema["name"]
        )  # Initialize the normalized data with the schema columns
        # Add the additional columns to the normalized data
        for col in file_info_columns:
            normalized_data[col] = ""
        # Lower case schema names
        schema_lower = [col.lower() for col in self.schema["name"].values]

        # Create a mapping dictionary between lower case schema names and original schema names
        schema_mapping = dict(zip(schema_lower, self.schema["name"].values, strict=False))

        # Load the schema dictionary to rename the columns
        schema_dict_file = get_project_base_path() / topic_config["schema_dict_file"]
        schema_dict = (
            pd.read_csv(schema_dict_file, sep=";")
            .set_index("original_name")["official_name"]
            .to_dict()
        )

        # Initialize the output dataframe for columns not in the schema
        datacolumns_out = pd.DataFrame(
            columns=["filename", "column_name", "column_type", "nb_non_null_values"]
        )

        for df in self.corpus:
            # Merge columns with the same name
            df = merge_duplicate_columns(df)
            # Rename columns using the schema dictionary
            safe_rename(df, schema_dict)
            # Lower case columns names
            df.columns = df.columns.astype(str)
            columns_lower = [col.lower() for col in df.columns]
            # Check if the dataframe has at least 1 column in common with the schema
            if len(set(columns_lower).intersection(set(schema_lower))) > 0:
                common_columns = []  # Initialize the list of common columns with the schema
                for col, col_lower in zip(df.columns, columns_lower, strict=False):
                    if col_lower in schema_lower or col in file_info_columns:
                        common_columns.append(col)
                    else:
                        # Add the column to the output dataframe for columns not in the schema
                        out_col_df = pd.DataFrame(
                            {
                                "filename": df["url"].iloc[0],
                                "column_name": col,
                                "column_type": df[col].dtype,
                                "nb_non_null_values": df[col].count(),
                            },
                            index=[0],
                        )
                        datacolumns_out = pd.concat(
                            [datacolumns_out, out_col_df], ignore_index=True
                        )

                # Filter the dataframe to keep only the common columns with the schema
                df_filtered = df[common_columns]
                # Rename the columns in df_filtered using the schema_mapping
                df_filtered.columns = [
                    schema_mapping[col.lower()] if col.lower() in schema_mapping else col
                    for col in df_filtered.columns
                ]
                # Append df_filtered to normalized_data
                normalized_data = pd.concat([normalized_data, df_filtered], ignore_index=True)

                self.logger.info("Normalized dataframe %s", df["url"].iloc[0])
                self.logger.info(
                    "Number of datapoints in normalized_data: %s", len(normalized_data)
                )
                self.logger.info(
                    "Number of columns in schema: %s",
                    len(common_columns) - len(file_info_columns),
                )
                self.logger.info(
                    "Number of columns not in schema: %s",
                    len(df.columns) - len(common_columns) + len(file_info_columns),
                )
            # If the dataframe has no column in common with the schema, add the dataframe to the output dataframe for files not in final data
            else:
                out_df = pd.DataFrame(df.iloc[0]).transpose()
                self.datafiles_out = pd.concat([self.datafiles_out, out_df], ignore_index=True)
                self.logger.warning(
                    "No column in common with schema for file %s", df["url"].iloc[0]
                )

        # Cast data to schema types
        schema_selected = self.schema.loc[:, ["name", "type"]]
        normalized_data = cast_data(normalized_data, schema_selected, "name")

        self.logger.info(
            "Data types per column after casting in normalized data: %s", normalized_data.dtypes
        )
        self.logger.info(
            "Percentage of NaN values after casting, per column: %s",
            (normalized_data.isna().sum() / len(normalized_data)) * 100,
        )

        # Drop potential duplicates (same values for schema & siren columns)
        subset_columns = list(self.schema["name"].values)
        subset_columns.append("siren")
        normalized_data = normalized_data.drop_duplicates(subset=subset_columns, keep="first")

        self.logger.info("Number of datapoints in normalized_data: %s", len(normalized_data))
        self.logger.info(
            "Number of columns in normalized_data: %s", len(normalized_data.columns)
        )
        self.logger.info(
            "Number of files not normalized: %s", len(self.datafiles_out) - len_out
        )
        self.logger.info("Number of columns in datacolumns_out: %s", len(datacolumns_out))
        self.logger.info(
            "Number of NaN values in normalized_data, per column: %s",
            normalized_data.isna().sum(),
        )

        return normalized_data, datacolumns_out
