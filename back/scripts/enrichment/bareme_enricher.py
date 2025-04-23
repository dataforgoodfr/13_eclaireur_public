from pathlib import Path
import typing
import polars as pl
import pandas as pd
from datetime import datetime

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.enrichment.subventions_enricher import SubventionsEnricher
from back.scripts.enrichment.marches_enricher import MarchesPublicsEnricher
from back.scripts.enrichment.financial_account_enricher import FinancialEnricher


class BaremeEnricher(BaseEnricher):
    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def get_dataset_name(cls) -> str:
        return "bareme"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> typing.List[Path]:
        return [
            CommunitiesSelector.get_output_path(main_config),
            SubventionsEnricher.get_output_path(main_config),
            FinancialEnricher.get_output_path(main_config),
            MarchesPublicsEnricher.get_output_path(main_config),
        ]

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[pl.DataFrame]) -> pl.DataFrame:
        communities, subventions, financial, marches_publics = inputs
        bareme = cls.build_bareme_table(communities)
        bareme = cls.bareme_subventions(subventions, financial, bareme)
        bareme_mp = cls.bareme_marchespublics(marches_publics, communities)
        bareme = bareme.join(bareme_mp, on=["siren", "annee"], how="left")
        return bareme

    @classmethod
    def build_bareme_table(cls, communities: pl.DataFrame) -> pl.DataFrame:
        current_year = datetime.now().year
        annees = pl.DataFrame({"annee": list(range(2016, current_year))})
        bareme_table = communities.select("siren").join(annees, how="cross")
        return bareme_table

    @classmethod
    def bareme_subventions(
        cls, subventions: pl.DataFrame, financial: pl.DataFrame, bareme_table: pl.DataFrame
    ) -> pl.DataFrame:
        current_year = datetime.now().year
        valid_years = list(range(2016, current_year))
        subventionsFiltred = subventions.filter(pl.col("annee").is_in(valid_years))

        sub_agg = (
            subventionsFiltred.group_by(["id_attribuant", "annee"])
            .agg(pl.col("montant").sum().alias("total_subventions_declarees"))
            .rename({"id_attribuant": "siren"})
        )

        budget = financial.select(["siren", "annee", "subventions"])

        bareme_table = bareme_table.join(sub_agg, on=["siren", "annee"], how="left").join(
            budget, on=["siren", "annee"], how="left"
        )

        bareme_table = bareme_table.with_columns(
            [
                pl.col("total_subventions_declarees").fill_null(0.0),
                pl.col("subventions").fill_null(0.0),
                (pl.col("subventions")).alias("subventions_budget"),
            ]
        )

        bareme_table = bareme_table.with_columns(
            [
                pl.when(pl.col("subventions_budget") != 0)
                .then(
                    (pl.col("total_subventions_declarees") / pl.col("subventions_budget"))
                    * 100.0
                )
                .otherwise(float("nan"))
                .alias("taux_subventions")
            ]
        )

        bareme_table = bareme_table.with_columns(
            [
                pl.col("taux_subventions")
                .map_elements(cls.get_score_from_tp)
                .cast(pl.Utf8)
                .alias("score_subventions")
            ]
        )

        return bareme_table.select(["siren", "annee", "taux_subventions", "score_subventions"])

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

    @classmethod
    def bareme_marchespublics(
        cls, marches_publics: pl.DataFrame, communities: pl.DataFrame
    ) -> pl.DataFrame:
        """
        Create a notation per community for marches publics
        """
        "TO DO : rajouter les colonnes du code de lieu d'exécution à la vérification de complétude"

        marches_pd = marches_publics.to_pandas()
        communities_pd = communities.to_pandas()

        marches_pd = marches_pd.dropna(subset=["acheteur_id"])

        # Mapping de obligation_publication vers (0 = pas d'obligation de publication, 1 = obligation de publication)
        marches_pd["obligation_publication_bool"] = (
            marches_pd["obligation_publication"]
            .map({"Obligatoire": 1, "Optionnel": 0})
            .astype(int)
        )

        # suppression de toutes les lignes dont les dates sont inférieures à 2018 (date de début de l'obligation de publication)
        marches_pd = marches_pd[marches_pd["annee_notification"] >= 2018]

        # Création d'un dataframe coll_years_df avec collectivité et années
        coll_df = communities_pd[["siren"]].copy()

        current_year = datetime.now().year
        years = list(range(2018, current_year + 1))
        years_df = pd.DataFrame({"annee": years}).copy()

        coll_df["key"] = 0
        years_df["key"] = 0

        coll_years_df = pd.merge(coll_df, years_df, on="key").drop("key", axis=1)

        # Left join des marchés publics avec le dataframe coll_years_df
        _merge = coll_years_df.merge(
            marches_pd,
            how="left",
            left_on=["siren", "annee"],
            right_on=["acheteur_id", "annee_notification"],
        )

        bareme = (
            _merge.groupby(["siren", "annee"])
            .agg(
                {
                    "id": pd.Series.count,
                    "obligation_publication_bool": pd.Series.sum,
                    "montant": pd.Series.sum,
                    "delai_publication_jours": cls.median_delay,
                    "date_notification": pd.Series.count,
                    "cpv_8": pd.Series.count,
                    "lieu_execution_nom": pd.Series.count,
                    "forme_prix": pd.Series.count,
                    "objet": pd.Series.count,
                    "nature": pd.Series.count,
                    "duree_mois": pd.Series.count,
                    "procedure": pd.Series.count,
                    "titulaire_id": pd.Series.count,
                }
            )
            .reset_index()
        )

        # Calcul du bareme

        ## Listes des colonnes obligatoires pour la completude des données
        ## (on vérifie que ces colonnes ont au moins une valeur non nulle par groupement)
        colonnes_completude = bareme[
            [
                "montant",
                "date_notification",
                "cpv_8",
                "lieu_execution_nom",
                "forme_prix",
                "objet",
                "nature",
                "duree_mois",
                "procedure",
                "titulaire_id",
            ]
        ]

        ## Note E : présence de données
        ## Note D : au moins une données avec obligation de publication
        ## Note C : au moins une donnée sans obligation de publication
        ## Note B : toutes les colonnes obligatoires sont présentes
        ## Note A : délai de publication median inférieur à 60 jours
        bareme["E"] = bareme["id"].map(lambda x: 1 if x > 0 else 0)
        bareme["D"] = bareme["obligation_publication_bool"].map(lambda x: 1 if x > 0 else 0)
        bareme["C"] = (bareme["id"] - bareme["obligation_publication_bool"]).map(
            lambda x: 1 if x > 0 else 0
        )
        bareme["B"] = colonnes_completude.all(axis=1).map(int)
        bareme["A"] = bareme["delai_publication_jours"].map(
            lambda x: 1 if x is not None and x <= 60 else 0
        )

        bareme["mp_score"] = bareme.apply(cls.score_total, axis=1)
        bareme = bareme.filter(items=["siren", "annee", "mp_score"])

        return pl.from_pandas(bareme)

    @staticmethod
    def score_total(row: pd.Series) -> str:
        if row["E"] == 0:
            return "E"
        if row["D"] == 0:
            return "D"
        if row["C"] == 0:
            return "C"
        if row["B"] == 0:
            return "B"
        return "A"

    @staticmethod
    def median_delay(series: pd.Series):
        """Custom aggregation function to avoid warning when slice contains only NaN values"""
        if all(series.isna()):
            return None
        return series.median()
