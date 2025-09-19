import re
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

        # Uniformise les noms des collectivités selon leur type
        communities = cls.uniformiser_noms(communities)

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

        return communities.join(
            bareme.filter(pl.col("annee") == target_year).select(
                ["siren", "mp_score", "subventions_score", "global_score"]
            ),
            on="siren",
            how="left",
        )

    @classmethod
    def national_mean(
        cls,
        filtered_data: pl.DataFrame,
        communities: pl.DataFrame,
        id_join_col: str,
        type_value: str,
    ) -> float:
        """Calcule la moyenne nationale pour un type donné."""
        return filtered_data.join(
            communities.filter(pl.col("type") == type_value).select("siren"),
            left_on=id_join_col,
            right_on="siren",
            how="inner",
        )["montant"].mean()

    @classmethod
    def group_mean(
        cls,
        filtered_data: pl.DataFrame,
        communities: pl.DataFrame,
        id_join_col: str,
        type_value: str,
        group_col: str,
        alias: str,
    ) -> pl.DataFrame:
        """Calcule la moyenne par groupe (région, département) et retourne un DataFrame prêt à join."""
        return (
            filtered_data.join(
                communities.filter(pl.col("type") == type_value).select(["siren", group_col]),
                left_on=id_join_col,
                right_on="siren",
                how="inner",
            )
            .group_by(group_col)
            .agg(pl.mean("montant").alias(alias))
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
        - COM : moyennes nationales, régionales, départementales
        - DEP : moyennes nationales, régionales
        - REG : moyenne nationale
        """
        # Filtrer sur l’année
        datas_filtered = datas.filter(pl.col(year_col) == year)

        # ============================================================
        # COMMUNES
        moyenne_nat_com = cls.national_mean(datas_filtered, communities, id_join_col, "COM")
        moyenne_reg_com = cls.group_mean(
            datas_filtered,
            communities,
            id_join_col,
            "COM",
            "code_insee_region",
            f"moyenne_reg_com_{suffix}",
        )
        moyenne_dpt_com = cls.group_mean(
            datas_filtered,
            communities,
            id_join_col,
            "COM",
            "code_insee_dept",
            f"moyenne_dpt_com_{suffix}",
        )

        # ============================================================
        # DÉPARTEMENTS
        moyenne_nat_dpt = cls.national_mean(datas_filtered, communities, id_join_col, "DEP")
        moyenne_reg_dpt = cls.group_mean(
            datas_filtered,
            communities,
            id_join_col,
            "DEP",
            "code_insee_region",
            f"moyenne_reg_dpt_{suffix}",
        )

        # ============================================================
        # RÉGIONS
        moyenne_nat_reg = cls.national_mean(datas_filtered, communities, id_join_col, "REG")

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
            # Masquer les moyennes non pertinentes
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

    @classmethod
    def uniformiser_noms(cls, communities: pl.DataFrame) -> pl.DataFrame:
        """
        Uniformise les noms des collectivités selon leur type :
        - COM -> "COMMUNE X"
        - DEP -> "DEPARTEMENT X"
        - REG -> "REGION X"
        """

        # Regex Communes et Départements
        regex_com = re.compile(r"^VILLE\s+DE\s+")
        regex_dep = re.compile(r"^DEPARTEMENT\s+(DE\s+LA\s+|DE\s+L['’]?\s*|DES\s+|DU\s+|DE\s+)")

        # Pattern pour les régions
        region_prefixes = [
            r"CONSEIL\s+REGIONAL\s+DE\s+LA",
            r"COLLECTIVITE\s+TERRITORIALE\s+DE",
            r"COLLECTIVITE\s+EUROPEENNE\s+DE",
            r"COLLECTIVITE\s+DE",
            r"REGION\s+DES",
        ]
        region_pattern = "|".join(region_prefixes)
        regex_reg = re.compile(f"^({region_pattern})")

        def nettoyer_nom(nom: str, type_: str) -> str:
            if nom is None:
                return ""
            nom = nom.upper().strip()

            prefixes = {
                "COM": ("COMMUNE ", regex_com),
                "DEP": ("DEPARTEMENT ", regex_dep),
                "REG": ("REGION ", regex_reg),
            }

            if type_ not in prefixes:
                return nom

            prefix, regex = prefixes[type_]
            nom = regex.sub("", nom).strip()
            if not nom.startswith(prefix):
                return f"{prefix}{nom}"
            return nom

        communities = communities.with_columns(
            pl.struct(["nom", "type"])
            .map_elements(
                lambda row: nettoyer_nom(row["nom"], row["type"]), return_dtype=pl.String
            )
            .alias("nom")
        )

        return communities
