import json
import logging
import re
from enum import Enum

import numpy as np
import pandas as pd
from unidecode import unidecode

from back.scripts.datasets.constants import FORMAT_PRIORITIES

"""
This script contains functions to manipulate DataFrames.
1 - Merging duplicate columns
2 - Renaming columns
3 - Casting data based on a schema
4 - Detecting the first row index where the data starts
5 - Detecting the first column index where the data starts
"""


class IdentifierFormat(Enum):
    SIREN = "siren"
    SIRET = "siret"


def merge_duplicate_columns(df: pd.DataFrame, separator: str = " / ") -> pd.DataFrame:
    """
    Identify columns with the same name and merge their content into a single column.
    """
    duplicate_columns = df.columns[df.columns.duplicated(keep=False)]

    for col in duplicate_columns.unique():
        first_col_index = df.columns.to_list().index(col)
        merged_serie = df[col].apply(lambda x: separator.join(x.dropna().astype(str)), axis=1)

        df = df.drop(columns=col)
        # The original order is retained to avoid any problems
        df.insert(first_col_index, col, merged_serie)

    return df


def safe_rename(df: pd.DataFrame, schema_dict: dict) -> pd.DataFrame:
    """
    This function renames columns of a DataFrame based on a dictionary of original column names mapped to new column names.

    If a column does not exist in the DataFrame, it is not raised as an error, but rather ignored.

    :param df: the DataFrame to rename columns in
    :param schema_dict: the dictionary of original column names mapped to new column names
    :return: the DataFrame with columns renamed
    """
    df = df.rename(columns=lambda col: unidecode(str(col).strip())).rename(
        columns=lambda col: col.split("/")[-1] if col.startswith("http") else col
    )
    lowered = [str.lower(x) for x in df.columns]
    actual_matching = {
        k: v
        for k, v in schema_dict.items()
        if k in df.columns
        and k != v
        # do not create a column that may become a duplicate
        and v.lower() not in lowered
    }
    return df.rename(columns=actual_matching)


# Function to cast the data in a DataFrame based on a schema (a DataFrame with two columns: 'name' and 'type')
def cast_data(data, schema, name_tag, clean_column_name_for_comparison=None):
    logger = logging.getLogger(__name__)
    # Dict between schema types and pandas types
    # https://pandas.pydata.org/pandas-docs/stable/user_guide/basics.html#basics-dtypes
    type_dict = {
        "string": "string",
        "integer": "Int64",
        "number": "float64",
        "boolean": "boolean",
        "date": "datetime64[ns]",
    }

    # Create a dictionary of original column names mapped to their cleaned versions for comparison
    if clean_column_name_for_comparison:
        original_to_cleaned_names = {
            col: clean_column_name_for_comparison(col) for col in data.columns
        }
    else:
        # If no cleaning function is provided, use the exact same column names
        original_to_cleaned_names = {col: col for col in data.columns}

    # Create a new dataframe with the same shape and columns as data
    casted_data = pd.DataFrame(columns=data.columns)

    # Go through each column in the data to cast it
    for original_name, cleaned_name in original_to_cleaned_names.items():
        # if column name is not in schema['name'].values, keep the exact same column
        if cleaned_name not in schema[name_tag].values:
            casted_data[original_name] = data[original_name]
        # if column name is in schema['name'].values, cast the column with the paired schema['type'] value
        else:
            # get the schema type for the column
            schema_type = schema.loc[schema[name_tag] == cleaned_name, "type"].values[0]
            # translate the schema type to pandas type using type_dict
            pandas_type = type_dict[schema_type]
            # clean & cast the column to the pandas type, based on internal function
            casted_data[original_name] = _clean_and_cast_col(data[original_name], pandas_type)
            logger.info(f"Column '{original_name}' has been casted to '{pandas_type}'")
    return casted_data


# Internal function to clean and cast a column based on its schema type
def _clean_and_cast_col(col, pandas_type):
    logger = logging.getLogger(__name__)
    # Make a copy of the orginal column
    col_original = col.copy()

    if pandas_type == "float64":
        # Replace ',' by '.' to handle French numeric format and remove spaces (including non-breaking spaces)
        col = col.replace({",": ".", "\\s+": "", "%": ""}, regex=True)
        col = pd.to_numeric(col, errors="coerce")  # Coerce errors will be set to NaN
    elif pandas_type == "datetime64[ns]":
        # Convert to datetime, with utc=true, errors will be coerced to NaT
        col = col.astype(str)
        col = col.apply(_parse_date)
        # Check if the data is timezone-aware
        if col.dt.tz is not None:
            col = col.dt.tz_localize(None)
    elif pandas_type == "string":
        col = col.astype(str)
        col = col.str.strip()
        col = col.astype(str)
    elif pandas_type == "Int64":
        # Arrondir les valeurs flottantes
        col = col.apply(lambda x: round(x) if not pd.isna(x) and isinstance(x, float) else x)
        # Convert to integer, note that 'Int64' can handle NaN values
        col = pd.to_numeric(col, errors="coerce").round().astype("Int64")
    elif pandas_type == "boolean":
        col = col.str.replace(r"\s+", "", regex=True).str.lower()
        # Convert to boolean, True for 'oui', False for 'non', case insensitive
        col = col.str.lower().map({"oui": True, "non": False, "false": False, "true": True})

    # Compare the original column with the copy to identify coerced values
    coerced_indices = col_original.index[(col_original.notnull()) & (col_original != col)]
    coerced_values = col_original.loc[coerced_indices]

    if not coerced_values.empty:
        # Log the coerced values and relevant information
        for index, value in coerced_values.items():
            if ("nan" not in str(value)) & (pd.isna(col.loc[index])):
                logger.error(
                    f"Value '{value}' supposed to be a '{pandas_type}' was coerced to {col[index]}"
                )

    return col.astype(pandas_type)  # Convert to specified pandas type


# Internal function to parse a date string
def _parse_date(date_str):
    try:
        # dateutil parser can handle different formats
        return pd.to_datetime(date_str, utc=True)
    except ValueError:
        # Handle the error if the date format is not recognized
        return pd.NaT  # Return 'Not a Time' for unparseable formats


# Function to detect the first row index in a DataFrame where the data starts
def detect_skiprows(df):
    # Find the last non-empty column
    last_non_empty_col = len(df.dropna(how="all", axis=1).columns) - 1
    # Get the first row index in this column
    first_row = df.iloc[:, last_non_empty_col].first_valid_index()
    return first_row


# Function to detect the first column index in a DataFrame where the data starts
def detect_skipcolumns(df):
    df_transposed = df.transpose().reset_index(drop=True)
    return detect_skiprows(df_transposed)


def normalize_column_names(df: pd.DataFrame) -> pd.DataFrame:
    return df.rename(columns=_normalise_column_name)


def _normalise_column_name(name: str) -> str:
    name = re.sub(r"[_\n.-]+", "_", name.lower())
    name = re.sub("^(fields|properties)_", "", name)
    name = re.sub("_?@value$", "", name)
    return name.strip()


def normalize_montant(frame: pd.DataFrame, id_col: str) -> pd.DataFrame:
    """
    Transform the selected columns to be float.
    """
    if id_col not in frame.columns:
        return frame

    if str(frame[id_col].dtype) == "float64":
        return frame.assign(**{id_col: np.abs(frame[id_col])})
    if str(frame[id_col].dtype) == "int64":
        return frame.assign(**{id_col: np.abs(frame[id_col].astype("float64"))})
    montant = (
        frame[id_col]
        .astype(str)
        .where(frame[id_col].notnull() & (frame[id_col] != ""))
        .str.replace(r"[\u20ac\xa0 ]", "", regex=True)
        .str.replace("euros", "")
        .str.strip()
    )
    with_double_digits = montant.str.match(r".*[.,]\d{2}$").astype(bool).fillna(False)
    with_single_digits = montant.str.match(r".*[.,]\d{1}$").astype(bool).fillna(False)
    montant = montant.str.replace(r"[,.]", "", regex=True).astype("float")

    montant = np.abs(
        np.where(
            with_single_digits,
            montant / 10,
            np.where(with_double_digits, montant / 100, montant),
        )
    )

    return frame.assign(**{id_col: montant})


def normalize_identifiant(
    frame: pd.DataFrame, id_col: str, format: IdentifierFormat = IdentifierFormat.SIRET
) -> pd.DataFrame:
    """
    Normalize identifier values in the specified column to either SIREN (9 digits) or SIRET (14 digits) format.

    Args:
        frame: Input DataFrame containing the identifier column
        id_col: Name of the column containing identifiers
        format: Target format for normalization (SIREN or SIRET)

    Returns:
        DataFrame with normalized identifiers

    Raises:
        RuntimeError: If the median length of identifiers is neither 9 (SIREN) nor 14 (SIRET)
    """
    if not isinstance(format, IdentifierFormat):
        raise RuntimeError(
            f"Format must be an IdentifierFormat enum value. Got: {type(format)}"
        )

    if id_col not in frame.columns:
        return frame
    frame = frame.assign(
        **{
            id_col: frame[id_col]
            .astype(str)
            .where(frame[id_col].notnull())
            .str.strip()
            .str.replace(".0", "")
            .str.replace(r"[\xa0 ]", "", regex=True)
        }
    )

    filling = 14 if format == IdentifierFormat.SIRET else 9
    median_length = frame[id_col].str.len().median()
    if median_length == 9:
        # identifier is actually siren
        return frame.assign(**{id_col: frame[id_col].str.zfill(9).str.ljust(filling, "0")})
    elif median_length == 14:
        # identifier is actually siret
        return frame.assign(**{id_col: frame[id_col].str.zfill(14).str[:filling]})
    raise RuntimeError("idBeneficiaire median length is neither siren not siret.")


def normalize_date(frame: pd.DataFrame, id_col: str) -> pd.DataFrame:
    if id_col not in frame.columns:
        return frame
    if frame[id_col].isnull().all():
        return frame.assign(**{id_col: pd.NaT})

    if str(frame[id_col].dtype) == "datetime64[ns, UTC]":
        dt = frame[id_col]
    elif str(frame[id_col].dtype) == "datetime64[ns]":
        dt = frame[id_col].dt.tz_localize("UTC")
    else:
        dt = frame[id_col].astype(str).where(frame[id_col].notnull())

        year_only = pd.to_numeric(dt, errors="coerce")
        if year_only.notna().any():
            year_only = year_only.fillna(0).astype(int).astype(str)
            dt = year_only + "-01-01"

        dt = pd.to_datetime(dt, dayfirst=is_dayfirst(dt), errors="coerce", utc=True)

    dt = dt.where(dt.dt.year >= 2000)

    if dt.dt.tz is None:
        dt = dt.dt.tz_localize("UTC")

    return frame.assign(**{id_col: dt})


def is_dayfirst(dts: pd.Series) -> bool:
    formats = dts.dropna().str.replace(r"\d", "d", regex=True)
    top_format = formats.value_counts().sort_values(ascending=False)
    if top_format.empty:
        return False
    top_format = top_format.index[0]
    return not top_format.startswith("d" * 4)


def expand_json_columns(df: pd.DataFrame, column: str) -> pd.DataFrame:
    """
    Add to a dataframe columns from keys of a json column.
    """
    if not column:
        raise ValueError("Column name is required.")
    expanded = pd.DataFrame.from_records(
        [_parse_json(x) for x in df[column].tolist()], index=df.index
    ).rename(columns=lambda col: f"{column}_{col}")

    dup_columns = sorted(set(expanded.columns) & set(df.columns))
    if dup_columns:
        raise ValueError(f"Duplicate columns while parsing json: {', '.join(dup_columns)}")
    return pd.concat([df, expanded], axis=1)


def _parse_json(content: str) -> dict:
    if pd.isna(content):
        return {}
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {}


def correct_format_from_url(df: pd.DataFrame) -> pd.DataFrame:
    """
    Identify the potential format of the file from the content of the url.
    """
    pat = r"\b(parquet|csv|xlsx?|json[idl]{0,}|pdf)\b"
    url_format = df["url"].str.extract(pat)[0]
    url_format = url_format.where(
        ~url_format.str.startswith("json").fillna(False), "json"
    ).fillna(df["format"])
    return df.assign(format=url_format)


def sort_by_format_priorities(df: pd.DataFrame, keep: bool = False) -> pd.DataFrame:
    out = df.assign(
        priority=df["format"]
        .map({n: i for i, n in enumerate(FORMAT_PRIORITIES)})
        .fillna(len(FORMAT_PRIORITIES)),
    ).sort_values(["priority"])
    if not keep:
        out = out.drop(columns=["priority"])
    return out
