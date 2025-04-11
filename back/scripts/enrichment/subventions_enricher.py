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
        subventions, sirene, financial, communities = inputs
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
      #  return subventions
    
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

        communities = cls.transform_codes(communities)
        # Enrichir avec les 3 niveaux
        financialFiltred = cls.enrich(financialFiltred, communities, "REG", "region", "code_insee_region_clean", "reg")
        financialFiltred = cls.enrich(financialFiltred, communities, "DEP", "dept", "code_insee_dept_clean", "dept")
        financialFiltred = cls.enrich(financialFiltred, communities, "COM", "insee_commune", "code_insee", "com")

        financialFiltred = financialFiltred.with_columns([
            pl.coalesce(["siren","siren_com", "siren_dept", "siren_reg"]).alias("siren"),
            pl.coalesce(["nom_com", "nom_dept", "nom_reg"]).alias("nom")
        ])


        # Supprimer les colonnes intermédiaires
        financialFiltred = financialFiltred.drop([
            "siren_com", "siren_dept", "siren_reg",
            "nom_com", "nom_dept", "nom_reg"
        ])

# Manip particulière : pas de correspondance entre les valeurs des financial_accounts et de communities, on le fait à la main

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
        financialFiltred = cls.transform_siren(financialFiltred)


        tauxPublication = []

        # Liste des années présentes dans dfSubSpent
        years = subventions.select("year").unique().to_series().to_list()

        for year in years:
            # Filtrage des subventions pour l'année
            yearly_df = subventions.filter(pl.col("year") == year)

            # Agrégation des montants par SIREN
            grouped = (
                yearly_df
                .groupby("id_attribuant")
                .agg(pl.col("montant").sum().alias("total_subSpent"))
            )

            for row in grouped.iter_rows(named=True):
                siren = row["id_attribuant"]
                subSpent = row["total_subSpent"]

                # Récupération du nom de la collectivité
                collec = yearly_df.filter(pl.col("id_attribuant") == siren).select("nomattribuant").item()

                # Récupération du budget correspondant
                budget_row = (
                    financialFiltred
                    .filter(
                        (pl.col("anneeexercice") == year) &
                        (pl.col("siren") == str(int(siren)))
                    )
                    .select("subventions")
                )

                if budget_row.height > 0:
                    subBudg = budget_row.item() * 1000.0
                    tp = (subSpent / subBudg) * 100.0

                    score = cls.get_score_from_tp(tp)
                else:
                    subBudg = 0.0
                    tp = float("nan")
                    score = "E"

                tauxPublication.append([
                    collec, int(siren), year,
                    f"{subSpent:1.2e}", f"{subBudg:1.2e}", f"{tp:2.2f}", score
                ])

        # Construction du DataFrame final
        tauxPubDict = pl.DataFrame(
            tauxPublication,
            schema=["nom", "siren", "year", "subSpent", "subBudg", "taux", "score"]
        ).sort(["siren", "year"])

    @classmethod
    def enrich(cls, financial_df, communities_df, level, left_key, right_key, suffix):
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

    @classmethod
    def transform_siren(cls, df):
        # Remplacer les valeurs dans la colonne 'siren' en fonction de la colonne 'dept'
        for dept_code, siren_value in allSiren_dict["Dep"].items():
            df = df.with_columns(
                pl.when(pl.col('dept') == dept_code)
                .then(pl.lit(siren_value))
                .otherwise(pl.col('siren'))
                .alias('siren')
            )
        return df
    
    @classmethod
    def transform_codes(cls, df):
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
    

    @staticmethod
    def get_score_from_tp(tp: float) -> str:
        """
        Return a score based on the taux de publication (tp).
        """
        if tp < 25:
            return "E"
        elif tp <= 50:
            return "D"
        elif tp <= 75:
            return "C"
        elif tp <= 95:
            return "B"
        elif tp <= 105:
            return "A"
        else:
            return "E"