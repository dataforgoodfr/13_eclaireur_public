import json
import logging
import re
from itertools import chain
from pathlib import Path
from typing import Tuple

import pandas as pd

from back.scripts.loaders.base_loader import retry_session

FORMATS_PATTERNS = {
    r"\bcsv\b": "csv",
    r"\bjson\b": "json",
    r"\bxml\b": "xml",
    r"\bhtml\b": "html",
    r"\bzip\b": "zip",
    r"\bexcel\b": "excel",
    r"\bxlsx\b": "excel",
    r"\bxls\b": "excel",
    r"\bparquet\b": "parquet",
}
IMPLEMENTED_FORMATS = sorted(set(FORMATS_PATTERNS.values()))

LOGGER = logging.getLogger(__name__)


class DataGouvAPI:
    def __init__(self):
        raise Exception("Utility class.")

    @staticmethod
    def dataset_resources(dataset_id: str, savedir: Path | None = None) -> pd.DataFrame:
        """
        Fetch information about all resources of a given dataset.
        """
        savedir = Path(savedir or ".")
        savedir.mkdir(exist_ok=True, parents=True)
        save_filename = savedir / f"dataset_{dataset_id}.parquet"
        if savedir and save_filename.exists():
            return pd.read_parquet(save_filename)

        url = f"https://www.data.gouv.fr/api/1/datasets/{dataset_id}/"
        datasets = []
        while url:
            metadata, url = __class__._next_page(url)
            datasets.append(
                [
                    {
                        "dataset_id": metadata["id"],
                        "title": metadata["title"],
                        "description": metadata["description"],
                        "frequency": metadata["frequency"],
                    }
                    | __class__._resource_infos(resource)
                    | __class__._organisation_infos(metadata["organization"])
                    for resource in metadata["resources"]
                ]
            )
        datasets = pd.DataFrame(
            list(chain.from_iterable(datasets)),
            columns=[
                "dataset_id",
                "title",
                "description",
                "frequency",
                "created_at",
                "resource_id",
                "resource_url",
                "format",
                "resource_description",
                "organization_id",
                "organization",
            ],
        )
        if savedir:
            datasets.to_parquet(save_filename)
        return datasets

    @staticmethod
    def organisation_datasets(
        organization_id: str, savedir: Path | None = None
    ) -> pd.DataFrame:
        """
        Fetch information about all datasets and resources of a given organization.
        """
        savedir = Path(savedir or ".")
        savedir.mkdir(exist_ok=True, parents=True)
        organisation_datasets_filename = savedir / f"orga_{organization_id}.parquet"
        if savedir and organisation_datasets_filename.exists():
            return pd.read_parquet(organisation_datasets_filename)

        url = "https://www.data.gouv.fr/api/1/datasets/"
        params = {"organization": organization_id}
        datasets = []
        while url:
            orga_datasets, url = __class__._next_page(url, params)
            datasets.append(
                [
                    {
                        "organization_id": metadata["organization"]["id"],
                        "organization": metadata["organization"]["name"],
                        "title": metadata["title"],
                        "description": metadata["description"],
                        "dataset_id": metadata["id"],
                        "frequency": metadata["frequency"],
                        "created_at": resource["created_at"],
                    }
                    | __class__._resource_infos(resource)
                    for metadata in orga_datasets
                    for resource in metadata["resources"]
                ]
            )
        datasets = pd.DataFrame(
            list(chain.from_iterable(datasets)),
            columns=[
                "organization_id",
                "organization",
                "title",
                "description",
                "dataset_id",
                "frequency",
                "format",
                "url",
                "created_at",
                "resource_description",
                "deleted_dataset",
                "resource_id",
                "resource_url",
            ],
        )
        if savedir:
            datasets.to_parquet(organisation_datasets_filename)
        return datasets

    @staticmethod
    def _resource_infos(resource: dict) -> dict:
        return {
            "resource_id": resource["id"],
            "resource_url": resource["url"],
            "format": resource["format"],
            "created_at": resource["created_at"],
            "resource_description": resource["description"],
        }

    @staticmethod
    def _organisation_infos(organization: dict) -> dict:
        return {"organization_id": organization["id"], "organization": organization["name"]}

    @staticmethod
    def _next_page(url: str, params: dict | None = None) -> Tuple[dict, str]:
        """
        Fetch the content of a given page and eventually the link to the next page.
        """
        session = retry_session(retries=5)
        response = session.get(url, params=params)
        try:
            response.raise_for_status()
        except Exception as e:
            logging.error(f"Error while downloading file from {url} : {e}")
            return [], None
        try:
            data = response.json()
        except json.JSONDecodeError as e:
            logging.error(f"Error while decoding json from {url} : {e}")
            return [], None
        return data.get("data", data), data.get("next_page")


def normalize_formats_description(formats: pd.Series) -> str:
    """
    Classify with regex the various description of formats available on data.gouv into a set of fixed categories.
    See `FORMATS_PATTERNS`for the list of patterns.

    For example : "file:///srv/udata/ftype/csv" will be transformed into "csv".
    """
    matching = {
        source: target
        for pat, target in FORMATS_PATTERNS.items()
        for source in formats.dropna().unique()
        if re.search(pat, source.lower())
    }
    return formats.map(matching).fillna(formats)


def select_implemented_formats(df: pd.DataFrame) -> pd.DataFrame:
    """
    Select datasets for which we implemented a reader for their formats.
    Log formats to be added.
    """
    valid_formats = df["format"].isin(IMPLEMENTED_FORMATS)
    incorrects = df.loc[~valid_formats, "format"].dropna().value_counts().to_dict()
    LOGGER.info("Non implemented file formats: %s", incorrects)
    return df[valid_formats]
