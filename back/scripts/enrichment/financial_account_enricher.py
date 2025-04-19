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
        return "financial"

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
        financial_filtred = cls._prepare_financial_data(financial)
        communities = cls.transform_codes(communities)
        financial_filtred = cls.enrich_siren(
            financial_filtred, communities, "REG", "region", "code_insee_region_clean", "reg"
        )
        financial_filtred = cls.enrich_siren(
            financial_filtred, communities, "DEP", "dept", "code_insee_dept_clean", "dept"
        )
        financial_filtred = cls.enrich_siren(
            financial_filtred, communities, "COM", "insee_commune", "code_insee", "com"
        )

        financial_filtred = financial_filtred.with_columns(
            [
                pl.coalesce(["siren_com", "siren_dept", "siren_reg"]).alias("siren"),
                pl.coalesce(["nom_com", "nom_dept", "nom_reg"]).alias("nom"),
            ]
        )

        financial_filtred = financial_filtred.drop(
            ["siren_com", "siren_dept", "siren_reg", "nom_com", "nom_dept", "nom_reg"]
        )

        # Manip particulière : pas de correspondance entre les valeurs des financial_accounts et de communities, on le fait à la main
        financial_filtred = cls.transform_siren(financial_filtred)

        return financial_filtred

    @classmethod
    def _prepare_financial_data(cls, financial: pl.DataFrame) -> pl.DataFrame:
        financial_filtred = financial.filter(pl.col("annee") > 2016)

        required_cols = ["region", "dept", "insee_commune"]
        for col in required_cols:
            if col not in financial_filtred.columns:
                financial_filtred = financial_filtred.with_columns(
                    pl.lit(None, dtype=pl.Utf8).alias(col)
                )

        financial_filtred = financial_filtred.with_columns(
            pl.when(
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
        )

    @classmethod
    def transform_siren(cls, df: pl.DataFrame) -> pl.DataFrame:
        all_siren_dict = {
            "Dep": {
                "02A": 200076958,  # Collectivité de Corse
                "02B": 172020018,  # Haute-Corse
                "067": 226700011,  # Collectivité européenne d'Alsace
                "068": 226800019,  # Haut-Rhin
                "101": 229710017,  # CTU Guadeloupe
                "102": 200052678,  # CTU Guyane
                "104": 229740014,  # CTU Réunion
                "106": 229850003,  # CTU Mayotte
            }
        }
        # Remplacer les valeurs dans la colonne 'siren' en fonction de la colonne 'dept'
        for dept_code, siren_value in all_siren_dict["Dep"].items():
            df = df.with_columns(
                pl.when(pl.col("dept") == dept_code)
                .then(pl.lit(siren_value).cast(pl.Utf8))
                .otherwise(pl.col("siren"))
                .alias("siren")
            )
        return df

    @classmethod
    def transform_codes(cls, df: pl.DataFrame) -> pl.DataFrame:
        # Création des colonnes 'code_insee_region_clean' et 'code_insee_dept_clean' avec les valeurs initiales
        df = df.with_columns(
            [
                pl.col("code_insee_region").alias("code_insee_region_clean"),
                pl.col("code_insee_dept").alias("code_insee_dept_clean"),
            ]
        )

        # Application des transformations pour les régions et départements
        df = df.with_columns(
            [
                pl.when((pl.col("type") == "REG") | (pl.col("type") == "CTU"))
                .then(
                    pl.when(pl.col("code_insee_region").str.len_chars() == 1)
                    .then(pl.lit("10") + pl.col("code_insee_region"))
                    .when(pl.col("code_insee_region").str.len_chars() == 2)
                    .then(pl.lit("0") + pl.col("code_insee_region"))
                    .otherwise(pl.col("code_insee_region"))
                )
                .alias("code_insee_region_clean"),
                pl.when((pl.col("type") == "DEP") | (pl.col("type") == "CTU"))
                .then(
                    pl.when(pl.col("code_insee_dept").str.len_chars() == 1)
                    .then(pl.lit("10") + pl.col("code_insee_dept"))
                    .when(pl.col("code_insee_dept").str.len_chars() < 3)
                    .then(pl.lit("0") + pl.col("code_insee_dept"))
                    .otherwise(pl.col("code_insee_dept"))
                )
                .alias("code_insee_dept_clean"),
            ]
        )

        return df
