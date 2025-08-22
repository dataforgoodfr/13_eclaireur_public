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

        communities = cls.averages_subventions(communities, subventions)

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
        cls, communities, subventions: pl.DataFrame
    ) -> pl.DataFrame:
        current_year = datetime.now().year

        # Filtrer les subventions de l'année en cours
        subventionsFiltred = subventions.filter(pl.col("annee") == current_year)

        ## Communes
        # Filtrer les communes
        communes = communities.filter(pl.col("type") == "COM")

        # Moyenne nationale des subventions pour les communes
        moyenne_nat_com = subventionsFiltred.filter(
            pl.col("id_attribuant").is_in(communes["siren"])
        ).select(pl.col("montant")).mean().item()

        # Moyenne régionale des subventions par région (uniquement communes) --> KO !!
        moyenne_reg_com = (
            subventionsFiltred.join(
                communes.select(["siren", "code_insee_region"]),
                left_on="id_attribuant",
                right_on="siren",
                how="inner"
            )
            .group_by("code_insee_region")
            .agg(pl.mean("montant").alias("moyenne_regionale_com_subventions"))
        )

        # Ajouter les moyennes aux communes
        communities = communities.join(moyenne_reg_com, on="code_insee_region", how="left") \
                                .with_columns(
                                    pl.when(pl.col("type") == "COM")
                                    .then(pl.lit(moyenne_nat_com))
                                    .otherwise(None)
                                    .alias("moyenne_nationale_com_subventions")
                                )

        """
        # 3️⃣ Moyenne départementale des subventions par département (uniquement communes)
        moyenne_dep_com = (
            subventions.join(
                communes.select(["siren", "departement"]),
                left_on="id_commune",
                right_on="siren",
                how="inner"
            )
            .group_by("departement")
            .agg(pl.mean("montant").alias("moyenne_dep_com"))
        )

        # 4️⃣ Ajouter les moyennes aux communes
        communities = communities.join(moyenne_reg_com, on="region", how="left") \
                                .join(moyenne_dep_com, on="departement", how="left") \
                                .with_columns(
                                    pl.when(pl.col("type") == "COM")
                                    .then(pl.lit(moyenne_nat_com))
                                    .otherwise(None)
                                    .alias("moyenne_nat_com")
                                )

        # ✅ Pour les départements : moyenne nationale et régionale des départements
        departements = communities.filter(pl.col("type") == "DEP")

        moyenne_nat_dep = subventions.filter(
            pl.col("id_commune").is_in(departements["siren"])
        ).select(pl.col("montant")).mean().item()

        moyenne_reg_dep = (
            subventions.join(
                departements.select(["siren", "region"]),
                left_on="id_commune",
                right_on="siren",
                how="inner"
            )
            .group_by("region")
            .agg(pl.mean("montant").alias("moyenne_reg_dep"))
        )

        communities = communities.join(moyenne_reg_dep, on="region", how="left") \
                                .with_columns(
                                    pl.when(pl.col("type") == "DEP")
                                    .then(pl.lit(moyenne_nat_dep))
                                    .otherwise(None)
                                    .alias("moyenne_nat_dep")
                                )

        # 5️⃣ Pour les régions : moyenne nationale des régions
        regions = communities.filter(pl.col("type") == "REG")
        moyenne_nat_reg = subventions.filter(
            pl.col("id_commune").is_in(regions["siren"])
        ).select(pl.col("montant")).mean().item()

        communities = communities.with_columns(
            pl.when(pl.col("type") == "REG")
            .then(pl.lit(moyenne_nat_reg))
            .otherwise(None)
            .alias("moyenne_nat_reg")
        )

"""



        """
        # Calculer la moyenne par attributant
        sub_agg = (
            subventionsFiltred
            .group_by("id_attribuant")
            .agg(pl.col("montant").mean().alias("moyenne_nationale_subventions"))
            .rename({"id_attribuant": "siren"})
        )

        # Remplacer les valeurs nulles par 0.0
        sub_agg = sub_agg.with_columns(pl.col("moyenne_nationale_subventions").fill_null(0.0))

        return sub_agg"""
        return communities
    
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
            .agg(pl.col("montant").mean().alias("moyenne_nationale_marches_publics"))
            .rename({"acheteur_id": "siren"})
        )

        # Remplacer les valeurs nulles par 0.0
        marches_publics_agg = marches_publics_agg.with_columns(pl.col("moyenne_nationale_marches_publics").fill_null(0.0))

        return marches_publics_agg
    
    @staticmethod
    def _map_score_to_numeric(column: str) -> pl.Expr:
        mapping = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}
        return pl.col(column).replace_strict(mapping).cast(pl.Int64)

    @staticmethod
    def _map_numeric_to_score(column: str) -> pl.Expr:
        mapping = {1: "A", 2: "B", 3: "C", 4: "D", 5: "E"}
        return pl.col(column).replace_strict(mapping)
