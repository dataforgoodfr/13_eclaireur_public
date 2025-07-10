import json
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


def normalize_commune_code(frame: pd.DataFrame, id_col: str) -> pd.DataFrame:
    if id_col not in frame.columns:
        return frame
    code = (
        frame[id_col]
        .astype(str)
        .where(frame[id_col].notnull())
        .str.replace(".0", "")
        .str.zfill(5)
    )
    return frame.assign(**{id_col: code})


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
            .where(frame[id_col].notnull() & (frame[id_col] != ""))
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
        return frame.assign(
            **{id_col: pd.Series([pd.NaT] * len(frame), dtype="datetime64[ns, UTC]")}
        )

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
    else:
        dt = dt.dt.tz_convert("UTC")

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


def clean_file_format(df: pd.DataFrame) -> pd.DataFrame:
    s_format = (
        df["format"]
        .str.lower()
        .str.removeprefix("application/")
        .str.removeprefix("text/")
        .str.replace("csv/utf8", "csv", regex=False)
    )
    return df.assign(format=s_format)


def sort_by_format_priorities(df: pd.DataFrame, keep: bool = False) -> pd.DataFrame:
    out = df.assign(
        priority=df["format"]
        .map({n: i for i, n in enumerate(FORMAT_PRIORITIES)})
        .fillna(len(FORMAT_PRIORITIES)),
    ).sort_values(["priority"])
    if not keep:
        out = out.drop(columns=["priority"])
    return out
