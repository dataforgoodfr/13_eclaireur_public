import copy
import decimal
import itertools
import json
import logging
import tempfile
from pathlib import Path
from urllib.request import urlretrieve

import ijson
import pandas as pd

from back.scripts.datasets.dataset_aggregator import DatasetAggregator
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)


class MarchePubliqueWorkflow(DatasetAggregator):
    @classmethod
    def from_config(cls, config):
        files = pd.DataFrame(
            {
                "url": [
                    "https://www.data.gouv.fr/fr/datasets/r/16962018-5c31-4296-9454-5998585496d2"
                ],
                "format": ["json"],
            }
        )
        return cls(files, config)

    def __init__(self, files: pd.DataFrame, config: dict):
        super().__init__(files, config)
        self._load_schema(config["schema"])
        print(self.official_schema.head().T)

    def _load_schema(self, url):
        schema_filename = self.data_folder / "official_schema.parquet"
        if schema_filename.exists():
            self.official_schema = pd.read_parquet(schema_filename)
            return

        self.official_schema = MarchesPublicsSchemaLoader.load(url, "marche").fillna(
            {"type": "string"}
        )
        self.official_schema.to_parquet(schema_filename)

    def _read_parse_file(self, file_metadata: tuple, raw_filename: Path) -> pd.DataFrame | None:
        self._read_parse_interim(raw_filename)
        return self._read_parse_final(raw_filename)

    def _read_parse_final(self, raw_filename: Path) -> pd.DataFrame | None:
        interim_fn = raw_filename.parent / "interim.json"
        if not interim_fn.exists():
            return None
        out = pd.read_json(interim_fn)
        object_columns = out.dtypes.pipe(lambda s: s[s == "object"]).index
        corrected = {out[c].astype("string").where(out[c].notnull()) for c in object_columns}
        return out.assign(**corrected)

    @tracker(ulogger=LOGGER, log_start=True)
    def _read_parse_interim(self, raw_filename: Path) -> None:
        interim_fn = raw_filename.parent / "interim.json"
        if interim_fn.exists():
            return

        with open(raw_filename, "r", encoding="utf-8") as raw:
            with open(interim_fn, "w") as interim:
                # Extract from the json individual declarations
                array_declas = ijson.items(raw, "marches.item", use_float=True)
                interim.write("[\n")

                # Iterate over the JSON array items
                for i, declaration in enumerate(array_declas):
                    if i:
                        interim.write(",\n")
                    unnested = [json.dumps(x) for x in self.unnest_marche(declaration)]
                    interim.write(",\n".join(unnested))

                interim.write("]\n")

    @staticmethod
    def unnest_marche(declaration: dict):
        local_decla = copy.copy(declaration)
        minimal_titulaire = [{"id": None}]
        titulaires = local_decla.pop("titulaires", minimal_titulaire) or minimal_titulaire

        unnested = {}
        for k, v in local_decla.items():
            if isinstance(v, (list, dict)):
                v = json.dumps(v)
            elif isinstance(v, decimal.Decimal):
                v = float(v)
            unnested[k] = v
        return [{f"titulaire_{k}": v for k, v in t.items()} | unnested for t in titulaires if t]


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
