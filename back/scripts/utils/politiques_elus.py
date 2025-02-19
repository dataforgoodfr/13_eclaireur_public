import pandas as pd
from tqdm import tqdm

from back.scripts.loaders.csv_loader import CSVLoader
from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.datagouv_api import dataset_resources

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


class ElusWorkflow:
    def __init__(self):
        self.data_folder = get_project_base_path() / "back" / "data" / "elus"
        self.data_folder.mkdir(exist_ok=True, parents=True)

        self.raw_data_folder = self.data_folder / "raw"
        self.raw_data_folder.mkdir(exist_ok=True, parents=True)

        self.processed_data_folder = self.data_folder / "processed"
        self.processed_data_folder.mkdir(exist_ok=True, parents=True)

        self.dataset_id = "5c34c4d1634f4173183a64f1"

    def fetch_raw_datasets(self):
        resources = dataset_resources(self.dataset_id, savedir=self.data_folder)
        for _, resource in tqdm(resources.iterrows()):
            filename = self.raw_data_folder / f"{resource['resource_id']}.parquet"
            if filename.exists():
                continue
            df = CSVLoader(resource["resource_url"]).load()
            df.to_parquet(filename)

    def combine_datasets(self):
        filename = self.processed_data_folder / "elus.parquet"
        if filename.exists():
            return pd.read_parquet(filename)

        resources = dataset_resources(self.dataset_id, savedir=self.data_folder)
        combined = []
        for _, resource in tqdm(resources.iterrows()):
            df = pd.read_parquet(self.raw_data_folder / f"{resource['resource_id']}.parquet")
            present_columns = {
                k: v for k, v in RENAME_COMMON_COLUMNS.items() if k in df.columns
            }
            df = (
                df[present_columns.keys()]
                .rename(columns=present_columns)
                .assign(mandat=resource["resource_description"])
            )
            combined.append(df)

        final = pd.concat(combined, ignore_index=True).assign(
            date_naissance=lambda df: pd.to_datetime(
                df["date_naissance"], dayfirst=True, errors="coerce"
            ),
            date_debut_mandat=lambda df: pd.to_datetime(
                df["date_debut_mandat"], dayfirst=True, errors="coerce"
            ),
            code_socio_pro=lambda df: df["code_socio_pro"].astype("Int16"),
        )
        final.to_parquet(filename)
        return final
