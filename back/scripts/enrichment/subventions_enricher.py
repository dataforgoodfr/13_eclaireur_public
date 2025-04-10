import typing
from pathlib import Path

import polars as pl
from polars import col

from back.scripts.datasets.sirene import SireneWorkflow
from back.scripts.datasets.topic_aggregator import TopicAggregator
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.datasets.communities_financial_accounts import FinancialAccounts
from back.scripts.communities.communities_selector import CommunitiesSelector


class SubventionsEnricher(BaseEnricher):
    @classmethod
    def get_dataset_name(cls) -> str:
        return "subventions"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> typing.List[Path]:
        return [
            TopicAggregator.get_output_path(        
                TopicAggregator.substitute_config(
                    "subventions", main_config["datafile_loader"]
                ),
                cls.get_dataset_name(),
            ),
            SireneWorkflow.get_output_path(main_config),
            FinancialAccounts.get_output_path(main_config),
            CommunitiesSelector.get_output_path(main_config)
        ]

    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[pl.DataFrame]) -> pl.DataFrame:
        """
        Enrich the raw subvention dataset
        """
        subventions, sirene, _,_ = inputs
        subventions = (
            subventions.with_columns(
                # Transform idAttribuant from siret to siren.
                # Data should already be normalized to 15 caracters.
                col("id_attribuant").str.slice(0, 9).alias("id_attribuant"),
                col("id_beneficiaire").str.slice(0, 9).alias("id_beneficiaire"),
            )
            .join(
                # Give the official sirene name to the attribuant
                sirene.select("siren", "raison_sociale"),
                left_on="id_attribuant",
                right_on="siren",
                how="left",
            )
            .with_columns(
                col("raison_sociale").fill_null(col("nom_attribuant")).alias("nom_attribuant")
            )
            .drop("raison_sociale")
            .join(
                # Give the official sirene name to the beneficiaire
                sirene.rename(lambda col: col + "_beneficiaire"),
                left_on="id_beneficiaire",
                right_on="siren_beneficiaire",
                how="left",
            )
            .with_columns(
                col("raison_sociale_beneficiaire")
                .fill_null(col("nom_beneficiaire"))
                .alias("nom_beneficiaire"),
                col("raison_sociale_beneficiaire")
                .is_not_null()
                .alias("is_valid_siren_beneficiaire"),
            )
            .drop("raison_sociale_beneficiaire")
        )
        return subventions
    
def transform_codes(df):
    # Création des colonnes 'code_insee_region_clean' et 'code_insee_dept_clean' avec les valeurs initiales
    df = df.with_columns([
        pl.col('code_insee_region').alias('code_insee_region_clean'),
        pl.col('code_insee_dept').alias('code_insee_dept_clean')
    ])

    # Application des transformations pour les régions et départements
    df = df.with_columns([
        pl.when((pl.col('type') == 'REG') | (pl.col('type') == 'CTU')) \
            .then(pl.when(pl.col('code_insee_region').str.len_chars() == 1)
                  .then(pl.lit('10') + pl.col('code_insee_region'))  # Utilisation de '+' pour la concaténation
                  .when(pl.col('code_insee_region').str.len_chars() == 2)
                  .then(pl.lit('0') + pl.col('code_insee_region'))  # Utilisation de '+' pour la concaténation
                  .otherwise(pl.col('code_insee_region'))) \
            .alias('code_insee_region_clean'),

        pl.when((pl.col('type') == 'DEP') | (pl.col('type') == 'CTU')) \
            .then(pl.when(pl.col('code_insee_dept').str.len_chars() == 1)
                  .then(pl.lit('10') + pl.col('code_insee_dept'))  # Utilisation de '+' pour la concaténation
                  .when(pl.col('code_insee_dept').str.len_chars() < 3)
                  .then(pl.lit('0') + pl.col('code_insee_dept'))  # Utilisation de '+' pour la concaténation
                  .otherwise(pl.col('code_insee_dept'))) \
            .alias('code_insee_dept_clean')
    ])

    return df
def enrich(financial_df, communities_df, level, left_key, right_key, suffix):
    filtered = communities_df.filter(pl.col("type") == level)
    return financial_df.join(
        filtered.select([
            pl.col(right_key),
            pl.col("siren").alias(f"siren_{suffix}"),
            pl.col("nom").alias(f"nom_{suffix}")
        ]),
        left_on=left_key,
        right_on=right_key,
        how="left"
    )

def transform_siren(df):
    # Remplacer les valeurs dans la colonne 'siren' en fonction de la colonne 'dept'
    for dept_code, siren_value in allSiren_dict["Dep"].items():
        df = df.with_columns(
            pl.when(pl.col('dept') == dept_code)
            .then(pl.lit(siren_value))
            .otherwise(pl.col('siren'))
            .alias('siren')
        )
    return df
def bareme_subvention(self,inputs: typing.List[pl.DataFrame]):
    subventions,sirene, financial,communities = inputs
    financialFiltred = financial.filter(pl.col('anneeexercice') > 2016)

    financialFiltred = financialFiltred.with_columns(
        pl.when(pl.col("siren").is_not_null())
        .then(pl.lit("GROUP"))
        .when(pl.col("region").is_not_null() & pl.col("dept").is_null() & pl.col("insee_commune").is_null())
        .then(pl.lit("REG"))
        .when(pl.col("dept").is_not_null() & pl.col("region").is_null() & pl.col("insee_commune").is_null())
        .then(pl.lit("DEP"))
        .otherwise(pl.lit("COM"))
        .alias("type")
    )

    communities = transform_codes(communities)
    # Enrichir avec les 3 niveaux
    financialFiltred = enrich(financialFiltred, communities, "REG", "region", "code_insee_region_clean", "reg")
    financialFiltred = enrich(financialFiltred, communities, "DEP", "dept", "code_insee_dept_clean", "dept")
    financialFiltred = enrich(financialFiltred, communities, "COM", "insee_commune", "code_insee", "com")

    financialFiltred = financialFiltred.with_columns([
        pl.coalesce(["siren","siren_com", "siren_dept", "siren_reg"]).alias("siren"),
        pl.coalesce(["nom_com", "nom_dept", "nom_reg"]).alias("nom")
    ])


    # Supprimer les colonnes intermédiaires
    financialFiltred = financialFiltred.drop([
        "siren_com", "siren_dept", "siren_reg",
        "nom_com", "nom_dept", "nom_reg"
    ])

# Dictionnaire des siren associés aux départements
    allSiren_dict = {
        "Dep": {
            "02A": 200076958,  # Collectivité de Corse
            "02B": 172020018,  # Haute-Corse
            "067": 226700011,  # Collectivité européenne d'Alsace
            "068": 226800019,  # Haut-Rhin
            "101": 229710017,  # CTU Guadeloupe
            "102": 200052678,  # CTU Guyane
            "104": 229740014,  # CTU Réunion
            "106": 229850003   # CTU Mayotte
        }
    }
    financialFiltred = transform_siren(financialFiltred)

    