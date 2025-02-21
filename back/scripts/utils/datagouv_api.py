import json
import logging
from itertools import chain
from pathlib import Path
from typing import Tuple

import pandas as pd

from back.scripts.loaders.base_loader import retry_session


def dataset_resources(dataset_id: str, savedir: Path | None = None) -> pd.DataFrame:
    """
    Fetch information about all resources of a given dataset.
    """
    save_filename = (savedir or Path(".")) / f"dataset_{dataset_id}.parquet"
    if savedir and save_filename.exists():
        return pd.read_parquet(save_filename)

    url = f"https://www.data.gouv.fr/api/1/datasets/{dataset_id}/"
    datasets = []
    while url:
        metadata, url = _next_page(url)
        datasets.append(
            [
                {
                    "dataset_id": metadata["id"],
                    "title": metadata["title"],
                    "description": metadata["description"],
                    "frequency": metadata["frequency"],
                }
                | _resource_infos(resource)
                | _organisation_infos(metadata["organization"])
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


def organisation_datasets(organization_id: str, savedir: Path | None = None) -> pd.DataFrame:
    """
    Fetch information about all datasets and resources of a given organization.
    """
    organisation_datasets_filename = (savedir or Path(".")) / f"orga_{organization_id}.parquet"
    if savedir and organisation_datasets_filename.exists():
        return pd.read_parquet(organisation_datasets_filename)

    url = "https://www.data.gouv.fr/api/1/datasets/"
    params = {"organization": organization_id}
    datasets = []
    while url:
        orga_datasets, url = _next_page(url, params)
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
                | _resource_infos(resource)
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
