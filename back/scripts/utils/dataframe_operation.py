import logging
import re

import pandas as pd

"""
This script contains functions to manipulate DataFrames.
1 - Merging duplicate columns
2 - Renaming columns
3 - Casting data based on a schema
4 - Detecting the first row index where the data starts
5 - Detecting the first column index where the data starts
"""


# Function to merge duplicate columns in a DataFrame
def merge_duplicate_columns(df: pd.DataFrame, separator: str = " / ") -> pd.DataFrame:
    duplicate_columns = df.columns[df.columns.duplicated(keep=False)]

    for col in duplicate_columns.unique():
        first_col_index = df.columns.to_list().index(col)
        merged_serie = df[col].apply(lambda x: separator.join(x.dropna().astype(str)), axis=1)

        df = df.drop(columns=col)
        # The original order is retained to avoid any problems
        df.insert(first_col_index, col, merged_serie)

    return df


# Function to rename columns in a DataFrame
def safe_rename(df, schema_dict):
    schema_dict_copy = schema_dict.copy()
    for original_name, official_name in schema_dict.items():
        if official_name in df.columns and original_name != official_name:
            del schema_dict_copy[original_name]
    df.rename(columns=schema_dict_copy, inplace=True)


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
    return df.rename(columns=lambda col: re.sub(r"[.-]", "_", col.lower()))
