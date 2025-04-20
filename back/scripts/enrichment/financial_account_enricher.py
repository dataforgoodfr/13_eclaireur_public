from pathlib import Path
import typing
import polars as pl

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.datasets.communities_financial_accounts import FinancialAccounts
from back.scripts.utils.config import get_project_base_path


class FinancialEnricher(BaseEnricher):
    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def get_dataset_name(cls) -> str:
        return "financial_accounts"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> typing.List[Path]:
        return [
            CommunitiesSelector.get_output_path(main_config),
            FinancialAccounts.get_output_path(main_config),
        ]

    @classmethod
    def get_output_path(cls, main_config: dict, output_type: str = "") -> Path:
        return (
            get_project_base_path()
            / main_config["warehouse"]["data_folder"]
            / f"{cls.get_dataset_name()}{output_type}.parquet"
        )

    @classmethod
    def enrich(cls, main_config: dict) -> None:
        inputs = list(map(pl.read_parquet, cls.get_input_paths(main_config)))
        financial = cls._clean_and_enrich(inputs)
        financial.write_parquet(cls.get_output_path(main_config, output_type=""))

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[pl.DataFrame]) -> pl.DataFrame:
        communities, financial = inputs
        financial_filtred = cls._add_financial_type(financial)
        financial_filtred = cls.clean_region_and_dep_columns(financial_filtred)

        financial_filtred = cls.enrich_siren(
            financial_filtred, communities, "REG", "region_clean", "code_insee_region", "reg"
        )
        financial_filtred = cls.enrich_siren(
            financial_filtred, communities, "DEP", "dep_clean", "code_insee_dept", "dept"
        )
        financial_filtred = cls.enrich_siren(
            financial_filtred, communities, "COM", "insee_commune_clean", "code_insee", "com"
        )

        financial_filtred = financial_filtred.with_columns(
            [
                pl.when(pl.col("type") == "COM")
                .then(pl.lit(None).cast(pl.Utf8))
                .otherwise(pl.col("siren_dept"))
                .alias("siren_dept"),
                pl.when(pl.col("type") == "COM")
                .then(pl.lit(None).cast(pl.Utf8))
                .otherwise(pl.col("siren_reg"))
                .alias("siren_reg"),
            ]
        )

        financial_filtred = financial_filtred.with_columns(
            [
                pl.coalesce(["siren_group", "siren_com", "siren_dept", "siren_reg"]).alias(
                    "siren"
                ),
            ]
        ).drop(["siren_com", "siren_dept", "siren_reg", "siren_group"])

        return financial_filtred

    @classmethod
    def _add_financial_type(cls, financial: pl.DataFrame) -> pl.DataFrame:
        financial_filtred = financial.filter(pl.col("annee") > 2016)
        if "siren" in financial_filtred.columns:
            financial_filtred = financial_filtred.rename({"siren": "siren_group"})
        else:
            financial_filtred = financial_filtred.with_columns(
                pl.lit(None).cast(pl.Utf8).alias("siren_group")
            )

        required_cols = ["region", "dept", "insee_commune"]
        for col in required_cols:
            if col not in financial_filtred.columns:
                financial_filtred = financial_filtred.with_columns(
                    pl.lit(None, dtype=pl.Utf8).alias(col)
                )
        financial_filtred = financial_filtred.with_columns(
            pl.when(pl.col("siren_group").is_not_null())
            .then(pl.lit("GROUP"))
            .when(
                pl.col("region").is_not_null()
                & pl.col("dept").is_null()
                & pl.col("insee_commune").is_null()
            )
            .then(pl.lit("REG"))
            .when(
                pl.col("dept").is_not_null()
                & pl.col("region").is_null()
                & pl.col("insee_commune").is_null()
            )
            .then(pl.lit("DEP"))
            .otherwise(pl.lit("COM"))
            .alias("type")
        )

        return financial_filtred

    @classmethod
    def enrich_siren(
        cls,
        financial_df: pl.DataFrame,
        communities_df: pl.DataFrame,
        level: str,
        left_key: str,
        right_key: str,
        suffix: str,
    ) -> pl.DataFrame:
        filtered = communities_df.filter(pl.col("type") == level)
        return financial_df.join(
            filtered.select(
                [
                    pl.col(right_key),
                    pl.col("siren").alias(f"siren_{suffix}"),
                    pl.col("nom").alias(f"nom_{suffix}"),
                ]
            ),
            left_on=left_key,
            right_on=right_key,
            how="left",
        ).with_columns(
            pl.coalesce([pl.col(f"siren_{suffix}"), pl.lit(None).cast(pl.Utf8)]).alias(
                f"siren_{suffix}"
            )
        )

    @classmethod
    def clean_region_and_dep_columns(cls, df: pl.DataFrame) -> pl.DataFrame:
        df = df.with_columns(
            [
                pl.col("region").str.slice(-2).alias("region_clean"),
                pl.col("dept").str.slice(-2).alias("dep_clean_temp"),
            ]
        )
        df = df.with_columns(
            [
                pl.when(
                    (pl.col("dept").str.len_chars() == 3)
                    & (pl.col("dept").str.slice(0, 1) == "1")
                )
                .then(pl.lit("97"))
                .otherwise(pl.col("dep_clean_temp"))
                .alias("dep_clean")
            ]
        )

        df = df.with_columns(
            [
                pl.when(pl.col("dep_clean") == "97")
                .then(
                    pl.concat_str(
                        [pl.col("dep_clean"), pl.col("insee_commune").str.replace("^0+", "")]
                    )
                )
                .otherwise(pl.concat_str([pl.col("dep_clean"), pl.col("insee_commune")]))
                .alias("insee_commune_clean")
            ]
        )

        df = df.drop("dep_clean_temp")

        return df
