import logging
from pathlib import Path

import pandas as pd

from back.scripts.datasets.dataset_aggregator import DatasetAggregator
from back.scripts.utils.dataframe_operation import normalize_date
from back.scripts.utils.datagouv_api import DataGouvAPI
from back.scripts.utils.typing import PandasRow

LOGGER = logging.getLogger(__name__)

RENAME_COMMON_COLUMNS = {
    "Nom de l'élu": "nom",
    "Prénom de l'élu": "prenom",
    "Code sexe": "sexe",
    "Date de naissance": "date_naissance",
    "Code de la catégorie socio-professionnelle": "code_socio_pro",
    "Libellé de la catégorie socio-professionnelle": "lib_socio_pro",
    "Date de début du mandat": "date_debut_mandat",
    "Date de début de la fonction": "date_debut_fonction",
    "Code du département": "code_dept",
    "Code de la commune": "code_commune",
    "Code du canton": "code_canton",
    "Libellé du canton": "lib_canton",
    "Code de la région": "code_region",
    "Libellé de la région": "lib_region",
    "Code de la section départementale": "code_section_dept",
    "Libellé de la section départementale": "lib_section_dept",
    "Code de la circonscription législative": "code_circo",
    "Libellé de la circonscription législative": "lib_circo",
    "Code de la collectivité à statut particulier": "code_collectivite",
    "Libellé de la collectivité à statut particulier": "lib_collectivite",
    "Libellé de la fonction": "lib_fonction",
    "N° SIREN": "siren_epci",
    "Libellé de l'EPCI": "lib_epci",
    "Code de la commune de rattachement": "code_commune",
    "Code de la circonscription métropolitaine": "code_circo_metropolitaine",
    "Code de la section - collectivité à statut particulier": "code_section_collectivite",
    "Code de la circonscription consulaire": "code_circo_consulaire",
    "Code de la circonscription AFE": "code_circo_afe",
    "Code de la circ. AFE": "code_circo_afe",
}


class ElectedOfficialsWorkflow(DatasetAggregator):
    """
    This dataset contains the list of all elected official in differents positions.
    In particular, it contains mayors, regional president, member of parliaments, etc...
    """

    DATASET_ID = "5c34c4d1634f4173183a64f1"

    @classmethod
    def get_config_key(cls) -> str:
        return "elected_officials"

    @classmethod
    def from_config(cls, config: dict):
        local_config = config[cls.get_config_key()]
        data_folder = Path(local_config["data_folder"])
        data_folder.mkdir(exist_ok=True, parents=True)
        resources = DataGouvAPI.dataset_resources(cls.DATASET_ID, savedir=data_folder).assign(
            url_hash=lambda df: df["resource_id"],
            url=lambda df: "https://www.data.gouv.fr/fr/datasets/r/" + df["resource_id"],
        )
        return cls(resources, config)

    def _normalize_frame(self, df: pd.DataFrame, file_metadata: PandasRow) -> pd.DataFrame:
        present_columns = {k: v for k, v in RENAME_COMMON_COLUMNS.items() if k in df.columns}
        return (
            df[present_columns.keys()]
            .rename(columns=present_columns)
            .assign(
                mandat=file_metadata.resource_description.split(" au ")[0],
                code_socio_pro=lambda df: df["code_socio_pro"].astype("Int16"),
            )
            .pipe(normalize_date, "date_naissance")
            .pipe(normalize_date, "date_debut_mandat")
            .pipe(normalize_date, "date_debut_fonction")
            .pipe(self._clean_nan_strs)
            .pipe(self._normalize_codes)
            .pipe(self._flag_leader)
        )

    def _clean_nan_strs(self, df: pd.DataFrame):
        columns = ["code_collectivite", "code_canton"]
        updates = {
            c: df[c].fillna("nan").where(lambda s: s != "nan") for c in columns if c in df
        }
        return df.assign(**updates)

    def _normalize_codes(self, df: pd.DataFrame):
        if "code_dept" in df.columns:
            df = df.assign(code_dept=df["code_dept"].str.zfill(2))
        if "code_commune" in df.columns:
            df = df.assign(code_commune=df["code_commune"].str.zfill(5))
        return df

    def _flag_leader(self, df: pd.DataFrame):
        return df.assign(
            is_leader=lambda df: df["lib_fonction"].str.startswith("Président")
            | (df["lib_fonction"] == "Maire")
        )
