import json
import typing
from pathlib import Path

import polars as pl
import pandas as pd
from inflection import underscore as to_snake_case

from back.scripts.datasets.cpv_labels import CPVLabelsWorkflow
from back.scripts.datasets.marches import MarchesPublicsWorkflow
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.enrichment.utils.cpv_utils import CPVUtils
from back.scripts.utils.dataframe_operation import (
    normalize_date,
    normalize_identifiant,
    normalize_montant,
)


class MarchesPublicsEnricher(BaseEnricher):
    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def get_dataset_name(cls) -> str:
        return "marches_publics"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> typing.List[Path]:
        return [
            MarchesPublicsWorkflow.get_output_path(main_config),
            CPVLabelsWorkflow.get_output_path(main_config),
        ]

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[pl.DataFrame]) -> pl.DataFrame:
        # Data analysts, please add your code here!
        marches, cpv_labels, *_ = inputs

        # marches = marches.pipe(cls.forme_prix_enrich).pipe(cls.type_prix_enrich)
        # do stuff with sirene
        print(marches.to_pandas()["titulaire_typeIdentifiant"].value_counts())
        marches_pd = (
            marches.to_pandas()
            .pipe(normalize_montant, "montant")
            .pipe(normalize_identifiant, "titulaire_id")
            .pipe(normalize_identifiant, "acheteur_id")
            .pipe(normalize_montant, "montant")
            .pipe(normalize_date, "datePublicationDonnees")
            .pipe(normalize_date, "dateNotification")
            .pipe(cls._add_metadata)
            .assign(montant=lambda df: df["montant"] / df["countTitulaires"].fillna(1))
        )

        return (
            pl.from_pandas(marches_pd)
            .pipe(CPVUtils.add_cpv_labels, cpv_labels=cpv_labels)
            .rename(to_snake_case)
        )

    @staticmethod
    def forme_prix_enrich(marches: pl.DataFrame) -> pl.DataFrame:
        return marches.with_columns(
            pl.when(pl.col("formePrix") == "Ferme, actualisable")
            .then(pl.lit("Ferme et actualisable"))
            .when(pl.col("formePrix") == "")
            .then(pl.lit(None))
            .otherwise(pl.col("formePrix"))
            .alias("forme_prix")
        ).drop("formePrix")

    @staticmethod
    def safe_typePrix_json_load(x):
        try:
            parsed = json.loads(x)
            if isinstance(parsed, list) and parsed:
                return parsed[0]
            elif isinstance(parsed, dict):
                type_prix = parsed.get("typePrix")
                if isinstance(type_prix, list) and type_prix:
                    return type_prix[0]
                if isinstance(type_prix, str):
                    return type_prix
            return None
        except (json.JSONDecodeError, TypeError):
            return None

    @staticmethod
    def type_prix_enrich(marches: pl.DataFrame) -> pl.DataFrame:
        return (
            marches.with_columns(
                pl.col("typesPrix").map_elements(
                    MarchesPublicsEnricher.safe_typePrix_json_load, return_dtype=pl.Utf8
                )
            )
            .with_columns(
                pl.coalesce(pl.col(["typesPrix", "typePrix", "TypePrix"])).alias("typePrix")
            )
            .with_columns(
                pl.when((pl.col("typePrix") == "") | (pl.col("typePrix") == "NC"))
                .then(pl.lit(None))
                .otherwise(pl.col("typePrix"))
            )
            .rename({"typePrix": "type_prix"})
            .drop(["typesPrix", "TypePrix"])
        )

    @classmethod
    def _add_metadata(cls, df: pd.DataFrame) -> pd.DataFrame:
        return df.assign(
            anneeNotification=df["dateNotification"].dt.year.astype("Int64"),
            anneePublicationDonnees=df["datePublicationDonnees"].dt.year.astype("Int64"),
            obligation_publication=pd.cut(
                df["montant"],
                bins=[0, 40000, float("inf")],
                labels=["Optionnel", "Obligatoire"],
                right=False,
            ),
            delaiPublicationJours=(
                df["datePublicationDonnees"] - df["dateNotification"]
            ).dt.days,
        )

    def _clean_missing_values(self, df: pd.DataFrame, file_metadata: tuple):
        """
        Clean the dataframe by removing rows where all values are missing.
        """
        must_have_columns = [
            "montant",
            "anneePublicationDonnees",
            "titulaire_id",
            "acheteur_id",
        ]
        missings = sorted(set(must_have_columns) - set(df.columns))
        if missings:
            self.missing_data.append(
                {
                    "url_hash": file_metadata.url_hash,
                    "missing_rate": 1.0,
                    "reason": "missing_columns",
                    "missing_columns": ",".join(missings),
                }
            )
            raise RuntimeError("Missing columns : " + ",".join(missings))

        missings = df[must_have_columns].isna()
        mask = missings.any(axis=1)
        missing_rate = mask.sum() / len(mask)
        if missing_rate > 0:
            missings = sorted(missings.sum().pipe(lambda s: s[s > 0]).index.values)
            self.missing_data.append(
                {
                    "url_hash": file_metadata.url_hash,
                    "missing_rate": missing_rate,
                    "reason": "missing_values",
                    "missing_columns": ",".join(missings),
                }
            )
        return df[~mask]
