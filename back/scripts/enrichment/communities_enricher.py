from datetime import datetime
from pathlib import Path

import polars as pl

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.enrichment.bareme_enricher import BaremeEnricher
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.enrichment.marches_enricher import MarchesPublicsEnricher
from back.scripts.enrichment.subventions_enricher import SubventionsEnricher


class CommunitiesEnricher(BaseEnricher):
    @classmethod
    def get_dataset_name(cls) -> str:
        return "communities"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> list[Path]:
        return [
            CommunitiesSelector.get_output_path(main_config),
            BaremeEnricher.get_output_path(main_config),
            SubventionsEnricher.get_output_path(main_config),
            MarchesPublicsEnricher.get_output_path(main_config),
        ]

    @classmethod
    def _clean_and_enrich(cls, inputs: list[pl.DataFrame]) -> pl.DataFrame:
        communities, bareme, subventions, marches_publics = inputs

        current_year = datetime.now().year
        target_year = current_year - 2

        communities_sub = cls.averages_subventions(subventions)
        communities = communities.join(communities_sub, on="siren", how="left")

        communities_mp = cls.averages_marches_publics(marches_publics)
        communities = communities.join(communities_mp, on="siren", how="left")

        return (
            communities.join(
                bareme.filter(pl.col("annee") == target_year).select(
                    ["siren", "mp_score", "subventions_score"]
                ),
                on="siren",
                how="left",
            )
            .with_columns(
                [
                    cls._map_score_to_numeric("mp_score").alias("mp_score_num"),
                    cls._map_score_to_numeric("subventions_score").alias("sub_score_num"),
                ]
            )
            .with_columns(
                [
                    ((pl.col("mp_score_num") + pl.col("sub_score_num")) / 2)
                    .floor()
                    .cast(pl.Int64)
                    .alias("global_score_num"),
                ]
            )
            .with_columns([cls._map_numeric_to_score("global_score_num").alias("global_score")])

            .drop(["mp_score_num", "sub_score_num", "global_score_num"])
        )
    
    @classmethod
    def averages_subventions(
        cls, subventions: pl.DataFrame
    ) -> pl.DataFrame:
        current_year = datetime.now().year

        # Filtrer les subventions de l'année en cours
        subventionsFiltred = subventions.filter(pl.col("annee") == current_year)

        # Calculer la moyenne par attributant
        sub_agg = (
            subventionsFiltred
            .group_by("id_attribuant")
            .agg(pl.col("montant").mean().alias("moyenne_subventions"))
            .rename({"id_attribuant": "siren"})
        )

        # Remplacer les valeurs nulles par 0.0
        sub_agg = sub_agg.with_columns(pl.col("moyenne_subventions").fill_null(0.0))

        return sub_agg
    
    @classmethod
    def averages_marches_publics(
        cls, marches_publics: pl.DataFrame
    ) -> pl.DataFrame:
        current_year = datetime.now().year

        # Filtrer les marchés publics de l'année en cours
        marches_publicsFiltred = marches_publics.filter(pl.col("annee_notification") == current_year)

        # Calculer la moyenne par acheteur
        marches_publics_agg = (
            marches_publicsFiltred
            .group_by("acheteur_id")
            .agg(pl.col("montant").mean().alias("moyenne_marches_publics"))
            .rename({"acheteur_id": "siren"})
        )

        # Remplacer les valeurs nulles par 0.0
        marches_publics_agg = marches_publics_agg.with_columns(pl.col("moyenne_marches_publics").fill_null(0.0))

        return marches_publics_agg
    
    @staticmethod
    def _map_score_to_numeric(column: str) -> pl.Expr:
        mapping = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}
        return pl.col(column).replace_strict(mapping).cast(pl.Int64)

    @staticmethod
    def _map_numeric_to_score(column: str) -> pl.Expr:
        mapping = {1: "A", 2: "B", 3: "C", 4: "D", 5: "E"}
        return pl.col(column).replace_strict(mapping)
