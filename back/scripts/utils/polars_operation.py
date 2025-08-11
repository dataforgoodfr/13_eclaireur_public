import re

import polars as pl

from back.scripts.utils.dataframe_operation import IdentifierFormat


def normalize_column_names_pl(frame: pl.LazyFrame) -> pl.LazyFrame:
    """
    Normalizes column names in a Polars LazyFrame.
    """

    def _normalize_col_name(name: str) -> str:
        name = re.sub(r"[\n\.\-]+", "_", name.lower())
        name = re.sub("^(fields|properties)_", "", name)
        name = re.sub("_?@value$", "", name)
        return name.strip()

    return frame.rename(
        {col: _normalize_col_name(col) for col in frame.collect_schema().names()}
    )


def normalize_identifiant_pl(
    frame: pl.LazyFrame, id_col: str, format: IdentifierFormat = IdentifierFormat.SIRET
) -> pl.LazyFrame:
    """
    Normalizes identifier values in the specified column to either SIREN (9 digits) or SIRET (14 digits) format
    using a per-row logic.
    """
    if id_col not in frame.collect_schema().names():
        return frame

    target_len = 14 if format == IdentifierFormat.SIRET else 9

    return frame.with_columns(
        pl.col(id_col)
        .cast(pl.Utf8)
        .str.strip_chars()
        .str.replace_all(r"\.0$", "")
        .str.replace_all(r"[\s\xa0]", "")
        .map_elements(lambda x: _format_identifier(x, target_len), return_dtype=pl.Utf8)
        .alias(id_col)
    )


def _format_identifier(identifier: str | None, target_len: int) -> str | None:
    if not identifier:
        return None

    if len(identifier) == 9:  # It's a SIREN
        return identifier.ljust(target_len, "0") if target_len == 14 else identifier

    if len(identifier) == 14:  # It's a SIRET
        return identifier[:9] if target_len == 9 else identifier

    return None  # Invalid length, return null
