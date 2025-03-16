import copy
import decimal
import itertools
import json
import logging
import tempfile
from functools import reduce
from pathlib import Path
from urllib.request import urlretrieve

import ijson
import pandas as pd

from back.scripts.datasets.dataset_aggregator import DatasetAggregator
from back.scripts.utils.config import project_config
from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)

DATASET_ID = "5cd57bf68b4c4179299eb0e9"


class MarchesPublicsWorkflow(DatasetAggregator):
    @classmethod
    def from_config(cls, config: dict):
        """
        Fetch all aggregated datasets regardin public orders.

        The data.gouv page is a combination of files containing a full year of contracts,
        and files containing only a month.
        We only select the monthly files if the year is not available on a yearly file.
        """
        if config["test_urls"]:
            return cls(
                pd.DataFrame.from_records([reduce(lambda x, y: x | y, config["test_urls"])]),
                config,
            )

        catalog = pd.read_parquet(project_config["datagouv_catalog"]["combined_filename"]).pipe(
            lambda df: df[df["dataset.id"] == DATASET_ID]
        )
        complete_years = catalog.assign(
            year=catalog["url"].str.extract(r"decp-(\d{4}).json")
        ).pipe(lambda df: df[df["year"].notna()])
        all_years = complete_years["year"].dropna().unique()

        monthly = catalog.assign(
            year=catalog["url"].str.extract(r"decp-(\d{4})-\d{2}.json")
        ).pipe(lambda df: df[df["year"].notna() & ~df["year"].isin(all_years)])

        files = pd.concat([complete_years, monthly])
        return cls(files, config)

    def __init__(self, files: pd.DataFrame, config: dict):
        super().__init__(files, config)
        self._load_schema(config["schema"])

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
        corrected = {c: out[c].astype("string").where(out[c].notnull()) for c in object_columns}
        return out.assign(**corrected)

    @tracker(ulogger=LOGGER, log_start=True)
    def _read_parse_interim(self, raw_filename: Path) -> None:
        """
        Create an intermediate JSON file with cleaned conventions,
        so that pandas can read it properly.
        """
        interim_fn = raw_filename.parent / "interim.json"
        if interim_fn.exists():
            return

        with open(raw_filename, "r", encoding="utf-8") as raw:
            with open(interim_fn, "w") as interim:
                # Ijson identifies each declaration individually
                # within the marches field.
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
        """
        Create one declaration line per titulaire.
        """
        local_decla = copy.copy(declaration)
        minimal_titulaire = [{"id": None}]
        titulaires = local_decla.pop("titulaires", minimal_titulaire) or minimal_titulaire
        if isinstance(titulaires, dict):
            titulaires = [titulaires]

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
        return flattened_schema
