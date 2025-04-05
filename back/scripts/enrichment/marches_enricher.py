from pathlib import Path
import typing
import polars as pl
from back.scripts.datasets.marches import MarchesPublicsWorkflow
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.utils.dataframe_operation import normalize_montant
import json


class MarchesPublicsEnricher(BaseEnricher):
    def __init__(self):
        raise Exception("Utility class.")

    @classmethod
    def get_dataset_name(cls) -> str:
        return "marches_publics"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> typing.List[Path]:
        return [MarchesPublicsWorkflow.get_output_path(main_config)]

    @classmethod
    def _clean_and_enrich(cls, inputs: typing.List[pl.DataFrame]) -> pl.DataFrame:
        # Data analysts, please add your code here!
        marches, *_ = inputs

        # TODO : nécessaire de modifier le dataset de test car pas identique à la réalité
        marches = cls.forme_prix_enrich(marches)
        marches = cls.type_prix_enrich(marches)

        marches_pd = (
            marches.to_pandas()
            .pipe(normalize_montant, "montant")
            .assign(
                montant=lambda df: df["montant"] / df["countTitulaires"].fillna(1)
            )  # distribute montant evenly when more than one contractor
        )
        return pl.from_pandas(marches_pd)

    @staticmethod
    def forme_prix_enrich(marches: pl.DataFrame) -> pl.DataFrame:
        marches = marches.with_columns(
            pl.when(pl.col("formePrix") == "Ferme, actualisable")
            .then(pl.lit("Ferme et actualisable"))
            .otherwise(pl.col("formePrix"))
        ).with_columns(
            pl.when(pl.col("formePrix") == "").then(pl.lit(None)).otherwise(pl.col("formePrix"))
        )

        return marches

    @staticmethod
    def type_prix_enrich(marches: pl.DataFrame) -> pl.DataFrame:
        def safe_typePrix_json_load(x):
            try:
                parsed = json.loads(x)
                # Vérifie si "typePrix" est une liste ou une chaîne et renvoie la première valeur ou la chaîne
                if isinstance(parsed["typePrix"], list):
                    return parsed["typePrix"][0]
                return parsed["typePrix"]  # Renvoie la valeur de typePrix si c'est une chaîne
            except (json.JSONDecodeError, KeyError, TypeError):
                try:
                    # Vérifier si la chaîne ressemble à une liste
                    if x.startswith("[") and x.endswith("]"):
                        parsed = json.loads(x)  # Essayer de convertir cette chaîne en liste
                        if isinstance(parsed, list):
                            # Si c'est une liste, renvoie le premier élément, ou None si la liste est vide
                            if parsed:
                                return parsed[0]
                            else:
                                return ""  # Liste vide
                except (json.JSONDecodeError, TypeError):
                    return ""

        marches = (
            marches.with_columns(
                pl.col("typesPrix").map_elements(safe_typePrix_json_load, return_dtype=pl.Utf8)
            )
            .with_columns(
                pl.coalesce(pl.col(["typesPrix", "typePrix", "TypePrix"])).alias("typePrix")
            )
            .with_columns(
                pl.when((pl.col("typePrix") == "") | (pl.col("typePrix") == "NC"))
                .then(pl.lit(None))
                .otherwise(pl.col("typePrix"))
            )
        )
        return marches
