import pandas as pd
import logging
from tqdm import tqdm

"""
This script contains functions to flatten JSON data and JSON schema.

1 - Flattening JSON schema overview:
    - Flatten a JSON schema by traversing the schema and extracting the properties of each object.
    - Each property is represented as a dictionary with the property name and its details.
     - Each property can be a simple property, an object, or an array of objects.
     - The extraction can be recursive for nested objects and arrays of objects, until the schema is fully flattened.

2 - Flattening JSON data overview:
    - Flatten JSON data by traversing the data and converting it into a flat structure.
    - The data can contain objects, arrays of objects, and simple properties.
    - The flattening process involves prefixing the keys with the parent keys and numbering the keys for arrays of objects.
    - The flattening can be recursive for nested objects and arrays of objects, until the data is fully flattened.

"""


def _flatten_schema_ref(prop, details, root_definitions):
    ref_path = details["$ref"].split("/")
    ref_detail = root_definitions
    # Traverse the reference path to get the details of the reference
    for part in ref_path[4:]:
        ref_detail = ref_detail[part]

    # If the reference points to a structure with 'properties', treat it as an object
    if "properties" in ref_detail:
        return _flatten_schema_object(prop, ref_detail, root_definitions)

    return _flatten_schema_property(prop, ref_detail, root_definitions)


def _flatten_schema_array(prop, details, root_definitions):
    if "items" in details:
        if "$ref" in details["items"]:
            return _flatten_schema_ref(prop, details["items"], root_definitions)
        elif "properties" in details["items"]:
            return _flatten_schema_object(
                prop, details, root_definitions
            )  # Abnormal case: If the items are objects, treat them as such
    return [{"property": prop}]


# Internal function used to flatten an object schema
def _flatten_schema_object(prop, details, root_definitions):
    flattened_schema = []
    for sub_prop, sub_details in details["properties"].items():
        flattened_schema.extend(
            _flatten_schema_property(f"{prop}.{sub_prop}", sub_details, root_definitions)
        )
    return flattened_schema


# Internal function used to differentiate between different types of schema properties
def _flatten_schema_property(prop, details, root_definitions):
    if "$ref" in details:
        return _flatten_schema_ref(prop, details, root_definitions)
    elif details.get("type") == "array":
        return _flatten_schema_array(prop, details, root_definitions)
    elif details.get("type") == "object" and "properties" in details:
        return _flatten_schema_object(prop, details, root_definitions)
    else:
        return [{"property": prop, **details}]


# Function to flatten a JSON schema
def flatten_json_schema(schema, schema_name):
    definitions = schema["definitions"][schema_name]["definitions"]
    properties = schema["definitions"][schema_name]["properties"]
    flattened_schema = []

    for prop, details in properties.items():
        flattened_schema.extend(_flatten_schema_property(prop, details, definitions))

    return flattened_schema


# Internal function used to flatten an object, prefixing the keys with parent_key
def _flatten_object(obj, parent_key=""):
    logger = logging.getLogger(__name__)
    items = {}
    if obj is None:
        return items  # Return an empty dictionary if the object is None
    for key, value in obj.items():
        try:
            # Prefix the key with the parent key if it exists
            new_key = f"{parent_key}.{key}" if parent_key else key
            # If the value is a dictionary, flatten it
            if isinstance(value, dict):
                items.update(_flatten_object(value, new_key))
            # If the value is a list of objects, flatten each object
            elif isinstance(value, list) and value and isinstance(value[0], dict):
                items.update(
                    _flatten_array_of_objects(value, new_key)
                )  # Recursively flatten if the value is a list of objects
            # Else, add the key-value pair to the items dictionary
            else:
                items[new_key] = value
        except Exception as e:
            logger.error(f"Erreur lors de l'aplatissage de l'objet JSON : {e}")
            raise e
    return items


# Internal function used to flatten an array of objects, numbering and prefixing the keys
def _flatten_array_of_objects(array, parent_key):
    items = {}
    for i, obj in enumerate(array[:15], start=1):
        obj_items = _flatten_object(obj, f"{parent_key}.{i}")
        for key, value in obj_items.items():
            items.setdefault(key, []).append(value)
    return items


# Internal function used to flatten a given row of JSON data, based on the type of data
def _flatten_row(row, exclude_prefix=None):
    flattened_row = {}
    for key, value in row.items():
        if exclude_prefix and key.startswith(exclude_prefix):
            continue
        # If the value is a list of objects, flatten each object
        if isinstance(value, list) and value and isinstance(value[0], dict):
            flattened_row.update(_flatten_array_of_objects(value, key))
        # If the value is an object, flatten it
        elif isinstance(value, dict):
            flattened_row.update(_flatten_object(value, key))
        else:  # Direct value or empty list
            flattened_row[key] = value
    return flattened_row


# Function to flatten JSON data - can be used in the workflow
def flatten_data(data, chunk_size=10000):
    chunks = []
    for i in range(0, len(data), chunk_size):
        chunk = data[i : i + chunk_size]
        processed_chunk = [_flatten_row(row) for row in tqdm(chunk) if row is not None]
        df_chunk = pd.DataFrame(processed_chunk)
        chunks.append(df_chunk)
    print("in")
    flattened_data = pd.concat(chunks, ignore_index=True)
    print("out")
    return flattened_data, pd.DataFrame()
