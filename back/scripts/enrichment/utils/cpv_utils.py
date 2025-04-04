import re
import typing
import polars as pl


class CPVUtils:
    # match if provided string is a group CPV (all digits but the first two and the last are zeros),
    #  and capture the first two digits identifying the division
    _CPV_EXACTLY_LEVEL_2_PATTERN = re.compile(r"^(\d{2})0{6}(?:-\d)?$")
    # match if provided string is a valid CPV and capture the first two digits identifying the division
    _CPV_LEVEL_2_PATTERN = re.compile(r"^(\d{2})\d{6}(?:-\d)?$")
    # match if provided string is a valid CPV and capture the first eight digits (last digit is a validation digit)
    _CPV_LEVEL_8_PATTERN = re.compile(r"^(\d{8})(?:-\d)?$")

    @classmethod
    def add_cpv_labels(
        cls, frame: pl.DataFrame, cpv_labels: pl.DataFrame, column="codeCPV"
    ) -> pl.DataFrame:
        "Extract the first two and eight digits of the provided CPV column, and add corresponding labels to frame."
        cpv_2_labels, cpv_8_labels = cls._get_cpv_2_and_8_labels(cpv_labels)
        return (
            frame.with_columns(
                cpv_2=pl.col(column)
                .cast(pl.String)
                .map_elements(
                    lambda cpv: cls._extract_sub_cpv(cpv, cls._CPV_LEVEL_2_PATTERN),
                ),
                cpv_8=pl.col(column)
                .cast(pl.String)
                .map_elements(
                    lambda cpv: cls._extract_sub_cpv(cpv, cls._CPV_LEVEL_8_PATTERN),
                ),
            )
            .join(cpv_2_labels, how="left", on="cpv_2")
            .join(cpv_8_labels, how="left", on="cpv_8")
        )

    @classmethod
    def _get_cpv_2_and_8_labels(
        cls, cpv_labels: pl.DataFrame
    ) -> typing.Tuple[pl.DataFrame, pl.DataFrame]:
        cpv_2_labels = cls._extract_labels(cpv_labels, cls._CPV_EXACTLY_LEVEL_2_PATTERN, 2)
        cpv_8_labels = cls._extract_labels(cpv_labels, cls._CPV_LEVEL_8_PATTERN, 8)
        return cpv_2_labels, cpv_8_labels

    @classmethod
    def _extract_labels(
        cls,
        cpv_labels: pl.DataFrame,
        pattern: re.Pattern,
        level: int,
        code_column="CODE",
        label_column="FR",
    ) -> pl.DataFrame:
        return (
            cpv_labels.with_columns(
                pl.col(code_column)
                .cast(pl.String)
                .map_elements(lambda cpv: cls._extract_sub_cpv(cpv, pattern)),
            )
            .filter(pl.col(code_column).is_not_null())
            .rename({code_column: f"cpv_{level}", label_column: f"cpv_{level}_label"})
        )

    @classmethod
    def _extract_sub_cpv(cls, cpv: pl.Expr, pattern: re.Pattern) -> str | None:
        match = pattern.match(cpv)
        return match.group(1) if match else None
