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

        # Calcul des moyennes des montants des subventions
        communities = cls.calculate_averages(
            communities,
            subventions,
            id_join_col="id_attribuant",
            year_col="annee",
            year=target_year,
            suffix="sub",
        )

        # Calcul des moyennes des montants des marches publics
        communities = cls.calculate_averages(
            communities,
            marches_publics,
            id_join_col="acheteur_id",
            year_col="annee_notification",
            year=target_year,
            suffix="mp",
        )

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
    def calculate_averages(
        cls,
        communities: pl.DataFrame,
        datas: pl.DataFrame,
        id_join_col: str,
        year_col: str,
        year: int,
        suffix: str,
    ) -> pl.DataFrame:
        """
        Calcule et ajoute les moyennes des données (subventions ou marchés publics) pour chaque type :

        - Pour les communes (COM) : moyennes nationales (de toutes les communes),
            régionales (des communes de la même région),
            départementales (des communes du même département).
        - Pour les départements (DEP) : moyennes nationales (de tous les départements),
            régionales (des départements de la même région).
        - Pour les régions (REG) : moyenne nationale (de toutes les régions).

        La méthode prend en compte uniquement les données sur une année et ajoute un suffixe aux colonnes pour différencier plusieurs types de données.
        """
        # Filtrer datas sur l'année courante
        datas_filtred = datas.filter(pl.col(year_col) == year)

        # ============================================================
        # COMMUNES
        communes = communities.filter(pl.col("type") == "COM")

        moyenne_nat_com = datas_filtred.join(
            communes.select(["siren"]), left_on=id_join_col, right_on="siren", how="inner"
        )["montant"].mean()

        moyenne_reg_com = (
            datas_filtred.join(
                communes.select(["siren", "code_insee_region"]),
                left_on=id_join_col,
                right_on="siren",
                how="inner",
            )
            .group_by("code_insee_region")
            .agg(pl.mean("montant").alias(f"moyenne_reg_com_{suffix}"))
        )

        moyenne_dpt_com = (
            datas_filtred.join(
                communes.select(["siren", "code_insee_dept"]),
                left_on=id_join_col,
                right_on="siren",
                how="inner",
            )
            .group_by("code_insee_dept")
            .agg(pl.mean("montant").alias(f"moyenne_dpt_com_{suffix}"))
        )

        # ============================================================
        # DÉPARTEMENTS
        departements = communities.filter(pl.col("type") == "DEP")

        moyenne_nat_dpt = datas_filtred.join(
            departements.select(["siren"]), left_on=id_join_col, right_on="siren", how="inner"
        )["montant"].mean()

        moyenne_reg_dpt = (
            datas_filtred.join(
                departements.select(["siren", "code_insee_region"]),
                left_on=id_join_col,
                right_on="siren",
                how="inner",
            )
            .group_by("code_insee_region")
            .agg(pl.mean("montant").alias(f"moyenne_reg_dpt_{suffix}"))
        )

        # ============================================================
        # RÉGIONS
        regions = communities.filter(pl.col("type") == "REG")

        moyenne_nat_reg = datas_filtred.join(
            regions.select(["siren"]), left_on=id_join_col, right_on="siren", how="inner"
        )["montant"].mean()

        # ============================================================
        # ASSEMBLAGE FINAL
        communities = (
            communities
            # communes
            .join(moyenne_reg_com, on="code_insee_region", how="left")
            .join(moyenne_dpt_com, on="code_insee_dept", how="left")
            # départements
            .join(moyenne_reg_dpt, on="code_insee_region", how="left")
            # moyennes nationales
            .with_columns(
                [
                    pl.when(pl.col("type") == "COM")
                    .then(pl.lit(moyenne_nat_com))
                    .alias(f"moyenne_nat_com_{suffix}"),
                    pl.when(pl.col("type") == "DEP")
                    .then(pl.lit(moyenne_nat_dpt))
                    .alias(f"moyenne_nat_dpt_{suffix}"),
                    pl.when(pl.col("type") == "REG")
                    .then(pl.lit(moyenne_nat_reg))
                    .alias(f"moyenne_nat_reg_{suffix}"),
                ]
            )
            # Masquer les moyennes type pour les lignes non-type
            .with_columns(
                [
                    pl.when(pl.col("type") != "COM")
                    .then(None)
                    .otherwise(pl.col(f"moyenne_reg_com_{suffix}"))
                    .alias(f"moyenne_reg_com_{suffix}"),
                    pl.when(pl.col("type") != "COM")
                    .then(None)
                    .otherwise(pl.col(f"moyenne_dpt_com_{suffix}"))
                    .alias(f"moyenne_dpt_com_{suffix}"),
                    pl.when(pl.col("type") != "DEP")
                    .then(None)
                    .otherwise(pl.col(f"moyenne_reg_dpt_{suffix}"))
                    .alias(f"moyenne_reg_dpt_{suffix}"),
                ]
            )
        )

        return communities

    @staticmethod
    def _map_score_to_numeric(column: str) -> pl.Expr:
        mapping = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}
        return pl.col(column).replace_strict(mapping).cast(pl.Int64)

    @staticmethod
    def _map_numeric_to_score(column: str) -> pl.Expr:
        mapping = {1: "A", 2: "B", 3: "C", 4: "D", 5: "E"}
        return pl.col(column).replace_strict(mapping)
