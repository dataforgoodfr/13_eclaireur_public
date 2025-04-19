from pathlib import Path
import typing
import polars as pl
import pandas as pd
from datetime import datetime

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.enrichment.subventions_enricher import SubventionsEnricher
from back.scripts.enrichment.marches_enricher import MarchesPublicsEnricher
from back.scripts.datasets.communities_financial_accounts import FinancialAccounts
from back.scripts.utils.config import get_project_base_path


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
            FinancialAccounts.get_output_path(main_config),
            MarchesPublicsEnricher.get_output_path(main_config),
        ]

    @classmethod
    def get_output_path(cls, main_config: dict, output_type: str = "") -> Path:
        return (
            get_project_base_path()
            / main_config["warehouse"]["data_folder"]
            / f"{cls.get_dataset_name()}{output_type}.parquet"
        )

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[pl.DataFrame]) -> pl.DataFrame:
        communities, subventions, financial, marches_publics = inputs

        # Data analysts, please add your code here!
        bareme = cls.build_bareme_table(communities)

        #  barem_sub = cls.bareme_subventions(subventions, financial, communities)
        barem_mp = cls.bareme_marchespublics(marches_publics, communities)
        bareme = bareme.join(barem_mp, on=["siren", "annee"], how="left")

        return bareme

    @classmethod
    def build_bareme_table(cls, communities: pl.DataFrame) -> pl.DataFrame:
        current_year = datetime.now().year
        annees = pl.DataFrame({"annee": list(range(2016, current_year))})
        bareme_table = communities.select("siren").join(annees, how="cross")
        return bareme_table

    @classmethod
    def bareme_subventions(
        cls, subventions: pl.DataFrame, financial: pl.DataFrame, communities: pl.DataFrame
    ) -> pl.DataFrame:
        subventionsFiltred = subventions.filter(pl.col("annee") > 2016)
        subventionsFiltred = subventionsFiltred.with_columns(pl.col("annee").cast(pl.Int64))
        financialFiltred = financial.filter(pl.col("annee") > 2016)

        required_cols = ["region", "dept", "insee_commune"]
        for col in required_cols:
            if col not in financialFiltred.columns:
                financialFiltred = financialFiltred.with_columns(
                    pl.lit(None, dtype=pl.Utf8).alias(col)
                )

        financialFiltred = financialFiltred.with_columns(
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

        communities = cls.transform_codes(communities)
        # Enrichir avec les 3 niveaux
        financialFiltred = cls.enrich_siren(
            financialFiltred, communities, "REG", "region", "code_insee_region_clean", "reg"
        )
        financialFiltred = cls.enrich_siren(
            financialFiltred, communities, "DEP", "dept", "code_insee_dept_clean", "dept"
        )
        financialFiltred = cls.enrich_siren(
            financialFiltred, communities, "COM", "insee_commune", "code_insee", "com"
        )

        financialFiltred = financialFiltred.with_columns(
            [
                pl.coalesce(["siren_com", "siren_dept", "siren_reg"]).alias("siren"),
                pl.coalesce(["nom_com", "nom_dept", "nom_reg"]).alias("nom"),
            ]
        )

        financialFiltred = financialFiltred.drop(
            ["siren_com", "siren_dept", "siren_reg", "nom_com", "nom_dept", "nom_reg"]
        )

        # Manip particulière : pas de correspondance entre les valeurs des financial_accounts et de communities, on le fait à la main
        all_sirens = communities.select("siren").unique().to_series().to_list()
        financialFiltred = cls.transform_siren(financialFiltred)
        tauxPublication = []
        current_year = datetime.now().year
        years = list(range(2017, current_year))

        for year in years:
            yearly_df = subventionsFiltred.filter(pl.col("annee") == year)

            # Agrégation des montants par SIREN
            grouped = yearly_df.group_by("id_attribuant").agg(
                pl.col("montant").sum().alias("total_subSpent")
            )
            sub_dict = {
                row["id_attribuant"]: row["total_subSpent"]
                for row in grouped.iter_rows(named=True)
            }
            for siren in all_sirens:
                subSpent = sub_dict.get(siren, 0.0)

                # for row in grouped.iter_rows(named=True):
                #     siren = row["id_attribuant"]
                #     subSpent = row["total_subSpent"]
                # Récupération du budget correspondant
                budget_row = financialFiltred.filter(
                    (pl.col("annee") == year) & (pl.col("siren") == siren)
                ).select("subventions")
                if budget_row.height > 0:
                    subBudg = budget_row.get_column("subventions").first() * 1000.0
                    if subBudg != 0:
                        tp = (subSpent / subBudg) * 100.0
                        score = cls.get_score_from_tp(tp)
                    else:
                        tp = float("nan")
                        score = float("nan")
                else:
                    subBudg = 0.0
                    tp = float("nan")
                    score = "E"
                tauxPublication.append(
                    [
                        siren,
                        year,
                        f"{subSpent:1.2e}",
                        f"{subBudg:1.2e}",
                        f"{tp:2.2f}",
                        score,
                    ]
                )

        # Construction du DataFrame final
        tauxPubDict = pl.DataFrame(
            tauxPublication,
            schema=["siren", "annee", "subSpent", "subBudg", "taux", "subventions_score"],
            orient="row",
        ).sort(["siren", "annee"])
        return tauxPubDict

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
    def bareme_marchespublics(cls, marches_publics, communities) -> pl.DataFrame:
        """
        Create a notation per community for marches publics
        """
        # On transforme les données en pandas pour le traitement
        marches_pd = marches_publics.to_pandas()
        communities_pd = communities.to_pandas()

        # Calcul du siren acheteur
        marches_pd["acheteur_siren"] = marches_pd["acheteur_id"]
        # Suppression des lignes sans acheteur_id
        marches_pd = marches_pd.dropna(subset=["acheteur_siren"])

        # Mapping de obligation_publication vers (0 = pas d'obligation de publication, 1 = obligation de publication)
        marches_pd["obligation_publication_bool"] = (
            marches_pd["obligation_publication"]
            .map({"Obligatoire": 1, "Optionnel": 0})
            .astype(int)
        )

        # suppression de toutes les lignes dont les dates sont inférieures à 2018 (date de début de l'obligation de publication)
        marches_pd = marches_pd[marches_pd["annee_notification"] >= 2018]

        # Merge avec les collectivités

        ## Création d'un dataframe coll_years_df avec collectivité et années
        coll_df = communities_pd[["siren"]].copy()

        current_year = datetime.now().year
        years = list(range(2018, current_year + 1))
        years_df = pd.DataFrame({"annee": years}).copy()

        coll_df["key"] = 0
        years_df["key"] = 0

        coll_years_df = pd.merge(coll_df, years_df, on="key").drop("key", axis=1)

        ## Left join des marchés publics avec le dataframe coll_years_df
        _merge = coll_years_df.merge(
            marches_pd,
            how="left",
            left_on=["siren", "annee"],
            right_on=["acheteur_siren", "annee_notification"],
        )

        # Groupement par siren (collectivité) et année
        def median_delay(series):
            """Custom aggregation function to avoid warning when slice contains only NaN values"""
            if all(series.isna()):
                return None
            return series.median()

        print(_merge["delai_publication_jours"])
        bareme = (
            _merge.groupby(["siren", "annee"])
            .agg(
                {
                    "id": pd.Series.count,
                    "obligation_publication_bool": pd.Series.sum,
                    "montant": pd.Series.sum,
                    "delai_publication_jours": median_delay,
                    "date_notification": pd.Series.count,
                    "cpv_8": pd.Series.count,
                    "lieu_execution.type_code": pd.Series.count,
                    "lieu_execution.code": pd.Series.count,
                    "lieu_execution.nom": pd.Series.count,
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
                "lieu_execution.type_code",
                "lieu_execution.code",
                "lieu_execution.nom",
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

        def score_total(row):
            if row["E"] == 0:
                return "E"
            if row["D"] == 0:
                return "D"
            if row["C"] == 0:
                return "C"
            if row["B"] == 0:
                return "B"
            return "A"

        bareme["mp_score"] = bareme.apply(score_total, axis=1)
        bareme = bareme.filter(items=["siren", "annee", "mp_score"])

        return pl.from_pandas(bareme)
