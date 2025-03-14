import itertools
import json
import logging
import re
import tempfile
from pathlib import Path
from urllib.request import urlretrieve

import pandas as pd
import unidecode
from scripts.loaders.json_loader import JSONLoader
from scripts.utils.dataframe_operation import cast_data

from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


class DatafileLoader:
    """
    DatafileLoader is responsible for loading, cleaning, selecting, and normalizing data from a JSON file.
    It uses a JSON schema to flatten the data and cast it to the correct types.
    It also uses a CommunitiesSelector to filter the data based on the selected communities.
    TODO: Everything is done in the __init__ method, it should be refactored to be more readable and maintainable (or using external libraries).
    """

    def __init__(self, communities_selector, topic_config):
        self.logger = logging.getLogger(__name__)

        self._load_schema(topic_config["schema"])
        self.loaded_data = self._load_data(
            topic_config
        )  # TODO : modifications_data seems empty & useless
        self.modifications_data = pd.DataFrame()
        # Clean data by keeping only columns present in the schema
        self.cleaned_data = self._clean_data()
        # Select data based on communities IDs
        self.communities_scope = communities_selector
        self.communities_ids = self.communities_scope.get_selected_ids()
        self.selected_data = self._select_data()
        # Remove secondary columns from the selected data (modifications columns, titulaires2+ columns, too many columns for POC)
        self.primary_data = self._remove_secondary_columns()
        # Drop duplicates and cast data to schema types
        self.normalized_data = self._normalize_data()

    def _load_schema(self, schema_topic_config):
        self.official_schema = MarchesPublicsSchemaLoader.load(
            schema_topic_config["url"], "marche"
        ).fillna({"type": "string"})

    @tracker(ulogger=LOGGER, log_start=True)
    def _load_data(self, topic_config):
        data_loader = JSONLoader(topic_config["unified_dataset"]["url"])
        main_df = data_loader.load()
        self.logger.info(
            f"Le fichier au format JSON a été téléchargé avec succès à l'URL : {topic_config['unified_dataset']['url']}"
        )
        return main_df

    def _clean_data(self):
        # Build a mapping of original column names to cleaned column names
        original_to_cleaned_names = {
            col: self.clean_column_name_for_comparison(col) for col in self.loaded_data.columns
        }
        # Get the set of cleaned column names from the schema
        schema_columns = set(self.official_schema["property"])
        # Find columns to keep depending on the schema
        columns_to_keep = set()
        for original_name, cleaned_name in original_to_cleaned_names.items():
            if cleaned_name in schema_columns:
                columns_to_keep.add(original_name)
        # Keep only the columns that are in the schema
        cleaned_data = self.loaded_data.filter(columns_to_keep)

        self.logger.info(
            f"Nettoyage des colonnes terminé, {len(columns_to_keep)} colonnes conservées."
        )

        # Keep specific 'marchés publics' rows (vs. concessions rows) using schema values differentiation
        # TODO : replace by a more generic method & use config... Or keep it here?
        procedure_values = self._get_schema_values("procedure", "enum")
        nature_values = self._get_schema_values("nature", "enum")
        type_pattern = self._get_schema_value("_type", "pattern")

        cleaned_data = cleaned_data[
            cleaned_data["procedure"].apply(self._matches_values, args=(procedure_values,))
            | cleaned_data["nature"].apply(self._matches_values, args=(nature_values,))
            | cleaned_data["_type"].str.match(type_pattern)
        ]

        return cleaned_data

    # Internal function to remove some characters from column names, for comparison
    def clean_column_name_for_comparison(self, column_name):
        return re.sub(r"\.\d+\.", ".", column_name)

    # Internal function to get schema values for a given property
    def _get_schema_values(self, property_name, column_name):
        values = self.official_schema.loc[
            self.official_schema["property"] == property_name, column_name
        ].iloc[0]
        return (
            [self._clean_value(value) for value in values]
            if isinstance(values, list)
            else self._clean_value(values)
        )

    # Internal function to get a unique schema value for a given property
    def _get_schema_value(self, property_name, column_name):
        return self.official_schema.loc[
            self.official_schema["property"] == property_name, column_name
        ].iloc[0]

    # Internal function to clean a value by removing accents, lowercasing and removing some characters
    def _clean_value(self, value):
        value = unidecode.unidecode(value).lower()
        return re.sub(r"[,']", "", value)

    # Internal function to check if a value matches a list of values
    def _matches_values(self, value, values):
        if pd.isna(value):
            return False
        cleaned_value = self._clean_value(value)
        return cleaned_value in values

    # Internal function to select data based on communities IDs
    def _select_data(self):
        cleaned_data = self.cleaned_data.copy()
        communities_data = self.communities_ids.copy()
        # Add 'siren' column to cleaned_data
        cleaned_data["siren"] = cleaned_data["acheteur.id"].str[:9].astype(str)
        communities_data["siren"] = communities_data["siren"].astype(str)
        # Merge cleaned_data with communities_data on 'siren' column, filtering out rows with NaN values
        selected_data = pd.merge(
            cleaned_data, communities_data, on="siren", how="left", validate="many_to_one"
        )
        selected_data = selected_data.dropna(subset=["type"])

        return selected_data

    # Internal function to remove secondary columns from the selected data (modifications columns, titulaires2+ columns)
    # TODO: Needed only because potentially way too many columns to handle
    def _remove_secondary_columns(self):
        # Drop columns with 'modifications.' or 'titulaires.' in their names
        primary_data = self.selected_data.loc[
            :,
            ~self.selected_data.columns.str.contains(
                r"modifications\.|titulaires\.\d+\.id|titulaires\.\d+\.typeIdentifiant"
            ),
        ].copy()
        # Select columns with 'titulaires.' and 'denominationSociale' in their names
        titulaires_cols = primary_data.filter(regex=r"^titulaires\.\d+\.denominationSociale")
        # Concatenate 'titulaires.*.denominationSociale' columns into a single 'titulaires' column
        primary_data["titulaires"] = titulaires_cols.apply(
            lambda row: ", ".join(row.dropna().astype(str).replace(r"[\[\]']", "")), axis=1
        )
        # Drop 'titulaires.*.denominationSociale' columns
        primary_data = primary_data.drop(columns=titulaires_cols.columns)

        return primary_data

    # Internal function to normalize data
    def _normalize_data(self):
        # Drop cleaned_data duplicates
        normalized_data = self.primary_data.applymap(
            lambda x: ",".join(map(str, x)) if isinstance(x, list) else x
        )
        normalized_data = normalized_data.drop_duplicates()

        # Cast data to schema types
        schema_selected = self.official_schema.loc[:, ["property", "type"]]
        normalized_data = cast_data(
            normalized_data,
            schema_selected,
            "property",
            clean_column_name_for_comparison=self.clean_column_name_for_comparison,
        )
        return normalized_data


class MarchesPublicsSchemaLoader:
    """
    Load a specific type of json into a DataFrame.
    This file has information spread i at least 2 subsections.
    This class mostly regroup legacy code that need a refactoring.
    """

    @tracker(ulogger=LOGGER, log_start=True)
    @staticmethod
    def load(url: str, type_marche: str) -> pd.DataFrame:
        with tempfile.TemporaryDirectory() as tmpdirname:
            json_filename = Path(tmpdirname) / "schema.json"
            urlretrieve(url, json_filename)

            with open(json_filename) as f:
                schema = json.load(f)
                return MarchesPublicsSchemaLoader._schema_to_frame(schema, type_marche)

    @staticmethod
    def _schema_to_frame(schema: dict, type_marche: str) -> pd.DataFrame:
        definitions = schema["definitions"][type_marche]["definitions"]
        properties = schema["definitions"][type_marche]["properties"]

        content = [
            MarchesPublicsSchemaLoader._flatten_schema_property(prop, details, definitions)
            for prop, details in properties.items()
        ]
        return pd.DataFrame.from_records(itertools.chain(*content))

    @staticmethod
    def _flatten_schema_property(prop, details, root_definitions):
        if "$ref" in details:
            return MarchesPublicsSchemaLoader._flatten_schema_ref(
                prop, details, root_definitions
            )
        elif details.get("type") == "array":
            return MarchesPublicsSchemaLoader._flatten_schema_array(
                prop, details, root_definitions
            )
        elif details.get("type") == "object" and "properties" in details:
            return MarchesPublicsSchemaLoader._flatten_schema_object(
                prop, details, root_definitions
            )
        else:
            return [{"property": prop, **details}]

    @staticmethod
    def _flatten_schema_ref(prop, details, root_definitions):
        ref_path = details["$ref"].split("/")
        ref_detail = root_definitions
        # Traverse the reference path to get the details of the reference
        for part in ref_path[4:]:
            ref_detail = ref_detail[part]

        # If the reference points to a structure with 'properties', treat it as an object
        if "properties" in ref_detail:
            return MarchesPublicsSchemaLoader._flatten_schema_object(
                prop, ref_detail, root_definitions
            )

        return MarchesPublicsSchemaLoader._flatten_schema_property(
            prop, ref_detail, root_definitions
        )

    @staticmethod
    def _flatten_schema_array(prop, details, root_definitions):
        if "items" in details:
            if "$ref" in details["items"]:
                return MarchesPublicsSchemaLoader._flatten_schema_ref(
                    prop, details["items"], root_definitions
                )
            elif "properties" in details["items"]:
                return MarchesPublicsSchemaLoader._flatten_schema_object(
                    prop, details, root_definitions
                )  # Abnormal case: If the items are objects, treat them as such
        return [{"property": prop}]

    @staticmethod
    def _flatten_schema_object(prop, details, root_definitions):
        flattened_schema = []
        for sub_prop, sub_details in details["properties"].items():
            flattened_schema.extend(
                MarchesPublicsSchemaLoader._flatten_schema_property(
                    f"{prop}.{sub_prop}", sub_details, root_definitions
                )
            )
        return flattened_schema
