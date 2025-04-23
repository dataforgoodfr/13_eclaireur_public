from pathlib import Path
import typing
import polars as pl
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
        marches = marches_publics.filter(
            pl.col("acheteur_id").is_not_null() & (pl.col("annee_notification") >= 2018)
        ).with_columns(
            pl.when(pl.col("obligation_publication") == "Obligatoire")
            .then(1)
            .otherwise(0)
            .alias("obligation_publication_bool")
        )

        current_year = datetime.now().year
        years_df = pl.DataFrame({"annee": list(range(2018, current_year + 1))})
        coll_df = communities.select(["siren"])
        coll_years_df = coll_df.join(years_df, how="cross")

        merged = coll_years_df.join(
            marches,
            left_on=["siren", "annee"],
            right_on=["acheteur_id", "annee_notification"],
            how="left",
        )

        bareme = merged.group_by(["siren", "annee"]).agg(
            [
                pl.count("id").alias("id"),
                pl.sum("obligation_publication_bool"),
                pl.sum("montant"),
                pl.median("delai_publication_jours"),
                *[
                    pl.count(col).alias(col)
                    for col in [
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
                ],
            ]
        )

        bareme = bareme.with_columns(
            [
                (pl.col("id") > 0).cast(pl.Int8).alias("E"),
                (pl.col("obligation_publication_bool") > 0).cast(pl.Int8).alias("D"),
                ((pl.col("id") - pl.col("obligation_publication_bool")) > 0)
                .cast(pl.Int8)
                .alias("C"),
                (
                    (pl.col("montant") > 0)
                    & (pl.col("date_notification").is_not_null())
                    & (pl.col("cpv_8").is_not_null())
                    & (pl.col("lieu_execution_nom").is_not_null())
                    & (pl.col("forme_prix").is_not_null())
                    & (pl.col("objet").is_not_null())
                    & (pl.col("nature").is_not_null())
                    & (pl.col("duree_mois").is_not_null())
                    & (pl.col("procedure").is_not_null())
                    & (pl.col("titulaire_id").is_not_null())
                )
                .cast(pl.Int8)
                .alias("B"),
                (pl.col("delai_publication_jours") <= 60)
                .fill_null(False)
                .cast(pl.Int8)
                .alias("A"),
            ]
        )
        bareme = bareme.with_columns(
            [
                pl.when(pl.col("E") == 0)
                .then(pl.lit("E"))
                .when(pl.col("D") == 0)
                .then(pl.lit("D"))
                .when(pl.col("C") == 0)
                .then(pl.lit("C"))
                .when(pl.col("B") == 0)
                .then(pl.lit("B"))
                .otherwise(pl.lit("A"))
                .alias("mp_score")
            ]
        )

        return bareme.select(["siren", "annee", "mp_score"])
