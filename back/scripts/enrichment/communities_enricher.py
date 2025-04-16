from pathlib import Path
import typing
import polars as pl
import pandas as pd

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.enrichment.base_enricher import BaseEnricher


class CommunitiesEnricher(BaseEnricher):
    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def get_dataset_name(cls) -> str:
        return "communities"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> typing.List[Path]:
        return [CommunitiesSelector.get_output_path(main_config)]

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[pl.DataFrame]) -> pl.DataFrame:
        communities, *_ = inputs
        # Data analysts, please add your code here!
        return communities

    @classmethod
    def bareme_marchespublics(cls, marches_publics, communities) -> pl.DataFrame:
        """
        Create a notation per community for marches publics
        """

        # NOTE : Ce code part du principe qu'il y a une colonne "id" dans le
        # dataframe des marches publics qui permet de regrouper par marché
        # et une colonne "obligation publication qui indique si le montant total
        # du marché est supérieur à 40 000 euros"

        marches_pd = marches_publics.to_pandas()
        communities_pd = communities.to_pandas()

        # Gestion des dates (à supprimer si le nettoyage est déjà fait)
        marches_pd["date_notification"] = pd.to_datetime(
            marches_pd["date_notification"], errors="coerce", format="%Y-%m-%d"
        )
        marches_pd["date_publication_donnees"] = pd.to_datetime(
            marches_pd["date_publication_donnees"], errors="coerce", format="%Y-%m-%d"
        )

        # Creation d'une colonne "annee"
        marches_pd["annee"] = marches_pd["date_notification"].dt.year
        marches_pd["annee"] = marches_pd["annee"].fillna(0).astype(int)

        # Calcul du nombre de jours entre la date de notification et la date de publication
        marches_pd["nbjours"] = (
            marches_pd["date_publication_donnees"] - marches_pd["date_notification"]
        )
        marches_pd["nbjours"] = marches_pd["nbjours"].fillna("0 days")
        marches_pd["nbjours"] = marches_pd["nbjours"].dt.days.astype("int32")

        # Calcul du siren acheteur
        marches_pd["acheteur_siren"] = marches_pd["acheteur_id"].str.extract(r"(\d{9})")

        # Suppression des lignes sans acheteur_id
        marches_pd = marches_pd.dropna(subset=["acheteur_siren"])

        # suppression de toutes les lignes dont les dates sont inférieures à 2018 (date de début de l'obligation de publication)
        marches_pd = marches_pd[marches_pd["annee"] >= 2018]

        # merge avec les collectivités
        _merge = marches_pd.merge(
            communities_pd[["siren"]], how="inner", left_on="acheteur_siren", right_on="siren"
        ).drop(columns=["siren"])

        # Groupement par acheteur_id et année
        def count_non_nulls(series):
            return series.notnull().sum()

        bareme = (
            _merge.groupby(["acheteur_siren", "annee"])
            .agg(
                {
                    "id": pd.Series.count,
                    "obligation_publication": pd.Series.sum,
                    "montant": pd.Series.sum,
                    "nbjours": pd.Series.median,
                    "cpv_8": count_non_nulls,
                    "lieu_execution.type_code": count_non_nulls,
                    "lieu_execution.code": count_non_nulls,
                    "lieu_execution.nom": count_non_nulls,
                    "forme_prix": count_non_nulls,
                    "objet": count_non_nulls,
                    "nature": count_non_nulls,
                    "duree_mois": count_non_nulls,
                    "procedure": count_non_nulls,
                    "titulaire_id": count_non_nulls,
                }
            )
            .reset_index()
        )

        bareme_completude = bareme[
            [
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

        # Calcul du bareme
        bareme["E"] = bareme["id"].map(lambda x: 1 if x > 0 else 0)
        bareme["D"] = bareme["obligation_publication"].map(lambda x: 1 if x > 0 else 0)
        bareme["C"] = (bareme["id"] - bareme["obligation_publication"]).map(
            lambda x: 1 if x > 0 else 0
        )
        bareme["B"] = bareme_completude.all(axis=1).map(int)
        bareme["A"] = bareme["nbjours"].map(lambda x: 1 if x <= 60 else 0)

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
        bareme = bareme.filter(items=["acheteur_siren", "annee", "mp_score"])

        return pl.from_pandas(bareme)
