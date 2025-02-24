"""This script is used to generate a test sample for the OFGL cities.

It takes as inputs:
- the full OFGL citites dataset, located at `<project-base-path>/ofgl-base-communes-consolidee.csv`
- the output datasets for subventions and marches publics obtained from sample data, but using the full OFGL cities dataset.

It does the following:
- load above datasets
- compute the set of all sirens found in subventions and marches publics
- filter the full cities dataset to keep only rows which siren where found in the previous step
- add the first 100 rows of the full dataset
- drop duplicates
- write output to `<project-base-path>/ofgl-base-communes-consolidee.test.csv`
"""

import pandas as pd
from pathlib import Path

ofgl_cities_full = pd.read_csv(
    Path.cwd() / "ofgl-base-communes-consolidee.csv", sep=";", dtype=str
)

marches = pd.read_csv(
    Path.cwd()
    / "back"
    / "data"
    / "datasets"
    / "marches_publics"
    / "outputs"
    / "normalized_data.csv",
    sep=";",
    dtype=str,
)
subventions = pd.read_csv(
    Path.cwd()
    / "back"
    / "data"
    / "datasets"
    / "subventions"
    / "outputs"
    / "normalized_data.csv",
    sep=";",
    dtype=str,
)
sirens = pd.concat([marches[["siren"]], subventions[["siren"]]]).drop_duplicates()
print(f"Found {len(sirens.index)} sirens")

ofgl_cities_filtered = ofgl_cities_full.merge(
    sirens, how="right", left_on="Code Insee 2023 Commune", right_on="siren"
)
print(f"Keeping {len(ofgl_cities_filtered.index)} cities")

ofgl_cities_head = ofgl_cities_full.head(100)

ofgl_test = pd.concat([ofgl_cities_filtered, ofgl_cities_head]).drop_duplicates()
print(f"Final: {len(ofgl_test.index)} cities")

ofgl_test.to_csv(
    Path.cwd() / "back" / "data" / "test" / "ofgl-base-communes-consolidee.test.csv",
    sep=";",
    index=False,
)
