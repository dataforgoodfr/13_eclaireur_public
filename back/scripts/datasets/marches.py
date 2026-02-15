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

from back.scripts.datasets.datagouv_catalog import DataGouvCatalog
from back.scripts.datasets.dataset_aggregator import DatasetAggregator
from back.scripts.utils.decorators import tracker
from back.scripts.utils.typing import PandasRow

LOGGER = logging.getLogger(__name__)

DATASET_ID = "5cd57bf68b4c4179299eb0e9"
UNNECESSARY_NESTED = [
    "considerationsSociales",
    "considerationsEnvironnementales",
    "modalitesExecution",
]
COLUMNS_RENAMER = {
    "modalitesExecution": "modaliteExecution",
    "techniques": "technique",
    "acheteur.id": "acheteur_id",
}

# Fields that only exist in DECP v2.0.3 and not in v1.5.0.
V2_ONLY_FIELDS = {"ccag", "marcheInnovant", "attributionAvance", "sousTraitanceDeclaree"}


class MarchesPublicsWorkflow(DatasetAggregator):
    @classmethod
    def get_config_key(cls) -> str:
        return "marches_publics"

    @classmethod
    def from_config(cls, main_config: dict):
        """
        Fetch all aggregated datasets regardin public orders.

        The data.gouv page is a combination of files containing a full year of contracts,
        and files containing only a month.
        We only select the monthly files if the year is not available on a yearly file.
        """
        config = main_config[cls.get_config_key()]
        if config["test_urls"]:
            return cls(
                pd.DataFrame.from_records([reduce(lambda x, y: x | y, config["test_urls"])]),
                main_config,
            )

        catalog = pd.read_parquet(DataGouvCatalog.get_output_path(main_config)).pipe(
            lambda df: df[df["dataset_id"] == DATASET_ID]
        )
        if catalog.empty:
            raise ValueError("No resources found for dataset_id: {}".format(DATASET_ID))

        complete_years = catalog.assign(
            year=catalog["base_url"].str.extract(r"decp-(\d{4}).json")
        ).pipe(lambda df: df[df["year"].notna()])
        all_years = complete_years["year"].dropna().unique()

        monthly = catalog.assign(
            year=catalog["base_url"].str.extract(r"decp-(\d{4})-\d{2}.json")
        ).pipe(lambda df: df[df["year"].notna() & ~df["year"].isin(all_years)])

        files = pd.concat([complete_years, monthly])
        return cls(files, main_config)

    def __init__(self, files: pd.DataFrame, config: dict):
        super().__init__(files, config)
        mp_config = config[self.get_config_key()]
        self._load_schema(mp_config["schema"])
        self._load_schema_v2(mp_config.get("schema_v2"))

    def _load_schema(self, url):
        schema_filename = self.data_folder / "official_schema.parquet"
        if schema_filename.exists():
            self.official_schema = pd.read_parquet(schema_filename)
            return

        self.official_schema = MarchesPublicsSchemaLoader.load(url, "marche").fillna(
            {"type": "string"}
        )
        self.official_schema.to_parquet(schema_filename)

    def _load_schema_v2(self, url: str | None):
        """Load v2.0.3 schema if a URL is provided."""
        if not url:
            self.official_schema_v2 = None
            return
        schema_filename = self.data_folder / "official_schema_v2.parquet"
        if schema_filename.exists():
            self.official_schema_v2 = pd.read_parquet(schema_filename)
            return
        try:
            self.official_schema_v2 = MarchesPublicsSchemaLoader.load(url, "marche").fillna(
                {"type": "string"}
            )
            self.official_schema_v2.to_parquet(schema_filename)
        except Exception as exc:
            LOGGER.warning("Failed to load v2 schema from %s: %s", url, exc)
            self.official_schema_v2 = None

    def _read_parse_file(
        self, file_metadata: PandasRow, raw_filename: Path
    ) -> pd.DataFrame | None:
        self._read_parse_interim(raw_filename)
        return self._read_parse_final(raw_filename)

    def _read_parse_final(self, raw_filename: Path) -> pd.DataFrame | None:
        interim_fn = raw_filename.parent / "interim.json"
        if not interim_fn.exists():
            return None
        out = pd.read_json(interim_fn).rename(columns=COLUMNS_RENAMER)
        object_columns = out.select_dtypes(include=["object"]).columns
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

        array_location = self.check_json_structure(raw_filename)

        def select_items(content):
            """
            filter top level elements according to detected json structure.
            """
            root_structure = array_location.split(".")
            for top_level in root_structure:
                if top_level in content:  # what to do when 'root_structure == "unknown"'
                    content = content[top_level]
            return content

        with open(raw_filename, "rb") as raw:
            raw_loaded = json.load(raw)
            raw_loaded = select_items(raw_loaded)
            with open(interim_fn, "w") as interim:
                interim.write("[\n")
                # Iterate over the JSON array items
                for i, declaration in enumerate(raw_loaded):
                    if i:
                        interim.write(",\n")
                    cleaned_row = json.dumps(self.clean_row(declaration))
                    interim.write(cleaned_row)

                interim.write("]\n")

    @staticmethod
    def check_json_structure(file_path: Path) -> str:
        """
        Check if the JSON file has the structure ['marches'] or ['marches']['marche']
        without loading the entire file.

        Returns:
        - parent path of the first list found (corresponding to the list of marches)
        - 'unknown': if neither structure is found
        """

        with open(file_path, "rb") as f:
            try:
                prefix_events = ijson.parse(f)
                for prefix, event, _value in prefix_events:
                    if event == "start_array":
                        return prefix

            except (StopIteration, ijson.JSONError):
                return "unknown"
        return "unknown"

    @staticmethod
    def detect_schema_version(declaration: dict) -> str:
        """Detect whether a single row uses v1.5.0 or v2.0.3 schema.

        Heuristic: v2.0.3 introduces fields like ``ccag``, ``marcheInnovant``,
        ``attributionAvance``, and ``sousTraitanceDeclaree`` that do not exist
        in v1.5.0.
        """
        if V2_ONLY_FIELDS.intersection(declaration.keys()):
            return "v2"
        return "v1"

    @staticmethod
    def _normalize_acheteur_id(raw_id: str) -> str:
        """In v2.0.3 acheteur.id is a 14-digit SIRET. Truncate to 9-digit
        SIREN to stay compatible with the rest of the pipeline."""
        raw_id = str(raw_id).strip()
        if raw_id.isdigit() and len(raw_id) == 14:
            return raw_id[:9]
        return raw_id

    @staticmethod
    def _ensure_lieu_execution_v2(declaration: dict) -> dict:
        """v2.0.3 lieuExecution has ``code`` and ``typeCode`` but no ``nom``.

        We reconstruct a ``nom`` placeholder from typeCode + code so the
        downstream enricher receives a value instead of null.
        """
        lieu = declaration.get("lieuExecution")
        if not lieu or not isinstance(lieu, dict):
            return declaration

        if "nom" not in lieu or lieu.get("nom") is None:
            code = lieu.get("code", "")
            type_code = lieu.get("typeCode", "")
            if code:
                lieu["nom"] = f"{type_code} {code}".strip()
            declaration["lieuExecution"] = lieu

        return declaration

    @staticmethod
    def clean_row(declaration: dict):
        """
        Nettoie le dataset brut de marché public (v1.5.0 et v2.0.3).
        """
        local_decla = copy.copy(declaration)

        schema_version = MarchesPublicsWorkflow.detect_schema_version(local_decla)

        if schema_version == "v2":
            local_decla = MarchesPublicsWorkflow._ensure_lieu_execution_v2(local_decla)

        cleaned_row = {}
        for k, v in local_decla.items():
            if k == "acheteur":
                try:
                    raw_id = str(v["id"])
                    cleaned_row["acheteur.id"] = (
                        MarchesPublicsWorkflow._normalize_acheteur_id(raw_id)
                        if schema_version == "v2"
                        else raw_id
                    )
                except TypeError:
                    cleaned_row["acheteur.id"] = ""
            elif k == "montant":
                cleaned_row["montant"] = v
            elif k == "titulaires":
                minimal_titulaire = [{"id": None}]
                titulaires = v or minimal_titulaire
                if isinstance(titulaires, dict):
                    titulaires = [titulaires]

                titulaires = [t for t in titulaires if t]

                if titulaires and "titulaire" in titulaires[0].keys():
                    titulaires = [titu["titulaire"] for titu in titulaires]

                titulaires = [
                    {
                        **titu,
                        "id": str(titu["id"])
                        if isinstance(titu.get("id"), int)
                        else titu.get("id"),
                    }
                    for titu in titulaires
                ]

                titulaires = sorted(titulaires, key=lambda x: x["id"] or "")

                cleaned_row["titulaires"] = titulaires
                cleaned_row["countTitulaires"] = len(titulaires)
            else:
                if isinstance(v, (list, dict)):
                    v = json.dumps(v)
                elif isinstance(v, decimal.Decimal):
                    v = float(v)
                cleaned_row[k] = v

        cleaned_row["_schema_version"] = schema_version
        return cleaned_row


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
