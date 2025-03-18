from pathlib import Path
import numpy as np
import polars as pl
from polars import col
import pandas as pd
import re
from datetime import datetime
from dateutil import parser

class DataWarehouseWorkflow:
    def __init__(self, config: dict):
        self._config = config
        self.warehouse_folder = Path(self._config["warehouse"]["data_folder"])
        self.warehouse_folder.mkdir(exist_ok=True, parents=True)

        self.send_to_db = []

        self.cleaner = DataCleaner()


    def run(self) -> None:
        sirene = pl.read_parquet(
            Path(self._config["sirene"]["data_folder"]) / "sirene.parquet"
        ).drop("raison_sociale_prenom")

        self._enrich_subventions(sirene)

    def _enrich_subventions(self, sirene: pl.DataFrame):
        """
        Enrich the raw subvention dataset
        """
        subventions = (
            pl.read_parquet(
                self._config["datafile_loader"]["combined_filename"] % {"topic": "subventions"}
            )
            .with_columns(
                # Transform idAttribuant from siret to siren.
                # Data should already be normalized to 15 caracters.
                col("idAttribuant").str.slice(0, 9).alias("idAttribuant"),
                col("idBeneficiaire").str.slice(0, 9).alias("idBeneficiaire"),
            )
            .join(
                # Give the official sirene name to the attribuant
                sirene.select("siren", "raison_sociale"),
                left_on="idAttribuant",
                right_on="siren",
                how="left",
            )
            .with_columns(
                col("raison_sociale").fill_null(col("nomAttribuant")).alias("nomAttribuant")
            )
            .drop("raison_sociale")
            .join(
                # Give the official sirene name to the beneficiaire
                sirene.rename(lambda col: col + "_beneficiaire"),
                left_on="idBeneficiaire",
                right_on="siren_beneficiaire",
                how="left",
            )
            .with_columns(
                col("raison_sociale_beneficiaire")
                .fill_null(col("nomBeneficiaire"))
                .alias("nomBeneficiaire"),
                col("raison_sociale_beneficiaire")
                .is_not_null()
                .alias("is_valid_siren_beneficiaire"),
            )
            .drop("raison_sociale_beneficiaire")
        )

        out_filename = self.warehouse_folder / "subventions.parquet"
        subventions.write_parquet(out_filename)

        self.send_to_db.append(out_filename)

        date_columns_subventions = [
            ('dateConvention', 'dateConventionFormatted', 'yearConvention') ]

        id_columns_subventions = [
            ('idAttribuant', 'idAttribuant_clean', 'siren_attribuant'),
            ('idBeneficiaire', 'idBeneficiaire_clean', 'siren_beneficiaire')]

        subventions_clean = self.cleaner.apply_cleaning(subventions.to_pandas(), date_columns_subventions, id_columns_subventions)

        exclude_columns = ['url'] 
        subventions_clean = self.cleaner.drop_duplicates_except(subventions_clean, exclude_columns)


        subventions_clean, removed_subventions = self.cleaner.filter_and_log_removals(
            subventions_clean, 
            montant_column='montant', 
            annee_column='yearConvention', 
            id_columns=['idAttribuant_clean', 'idBeneficiaire_clean']
        )

        updater = DataUpdater(subventions_clean, path_to_data=self._config["warehouse"]["data_folder"], path_to_output=self._config["warehouse"]["data_folder"])      
        
        subventions_updated = updater.update_subventions_data()
        
        out_filename = self.warehouse_folder / "subventions_final.parquet"

        subventions_updated = subventions_updated.loc[:, ~subventions_updated.columns.duplicated()]
        subventions_updated.to_parquet(out_filename)

        removed_subventions.to_csv(self.warehouse_folder / "removed_subventions.csv")




class DataCleaner:
    def __init__(self):
        pass

    def clean_numeros(self, value):
        """Nettoie les numéros selon plusieurs critères."""
        if pd.isna(value) or str(value).strip().lower() in {"non renseigné", "non", "nan", "none", ""}:
            return np.nan, 'Nan'
        if isinstance(value, float) and value.is_integer():
            value = str(int(value))   

        value = str(value).strip().replace("\xa0", "").replace("\t", "").replace("\n", "")
        
        # Cas 1 : Lettres invalides
        if any(c.isalpha() for c in value) and not re.search(r'[eE]\+?\d', value):
            return np.nan, 'Lettres invalides'
        
        # Cas 2 : Notation scientifique mal écrite
        if re.match(r"^\d+,\d+E\+\d+$", value):
            value = value.replace(',', '.')
            try:
                cleaned_value = str(int(float(value)))
                if len(cleaned_value) > 14:
                    return np.nan, 'Notation scientifique'
                return cleaned_value.zfill(14), 1
            except (OverflowError, ValueError):
                return np.nan, 'Notation scientifique'
        
        # Cas 3 : Nombre à 14 chiffres
        if re.match(r"^\d{14}$", value):
            return value, 'Nombre à 14 chiffres'
        
        # Cas 4 : Suppression des espaces
        if ' ' in value:
            return value.replace(" ", "").zfill(14), 'Suppression des espaces'
        
        # Cas 5 : Suppression des décimales
        if re.match(r"^\d+[.,]\d{2}$", value):
            return value.split(',')[0].zfill(14) if ',' in value else value.split('.')[0].zfill(14), 'Suppression des décimales'
        
        # Cas 6 : Nombre à 12 chiffres
        if value.isdigit() and len(value) < 14:
            return value.zfill(14), 'Less than 14'
        # if value.endswith('.0'):
        #     value = value.split('.')[0]       

        return value, 'Good'

    def extract_siren_from_siret(self, siret):
        """Extrait les 9 premiers chiffres du SIRET pour obtenir le SIREN."""
        if isinstance(siret, str) and len(siret) == 14 and siret.isdigit():
            return siret[:9]
        return np.nan

    def detect_and_fix_dates(self, dates):
        """Détecte et corrige les erreurs de format de date, renvoie une liste de dates formatées et l'année extraite."""
        fixed_dates, years = [], []
        
        for date in dates:
            if pd.isna(date):
                fixed_dates.append(None)
                years.append(None)
                continue

            date = str(date).strip()
            if date.isdigit() and len(date) == 4:  # Cas d'une année seule
                year = int(date)
                fixed_dates.append(None if 2016 <= year <= datetime.now().year else None)
                years.append(int(year) if 2016 <= year <= datetime.now().year else None)
                continue

            try:
                parsed_date = parser.parse(date, fuzzy=True)
                if 2000 <= parsed_date.year <= datetime.now().year:
                    fixed_dates.append(parsed_date.strftime("%Y-%m-%d"))
                    years.append(int(parsed_date.year))
                else:
                    fixed_dates.append(None)
                    years.append(None)
            except Exception:
                fixed_dates.append(None)
                years.append(None)

        return fixed_dates, years
    

    def filter_and_log_removals(self, df, montant_column, annee_column, id_columns):
        """
        Supprime les lignes où au moins une des valeurs dans les colonnes spécifiées (montant, année, idAttribuant, idAcheteur, idBeneficiaire)
        est nulle (NaN). Conserve ces lignes supprimées dans un DataFrame et affiche le nombre de lignes supprimées.
        """
        condition_annee = df[annee_column].isna().any(axis=1) if isinstance(annee_column, list) else df[annee_column].isna()
        condition_ids = df[id_columns].isna().any(axis=1) if isinstance(id_columns, list) else df[id_columns].isna()

        condition = df[montant_column].isna() | condition_annee | condition_ids

        removed_rows = df[condition]
        df_cleaned = df[~condition]

        print(f"Lignes supprimées où au moins une des valeurs ({montant_column}, {annee_column}, {', '.join(id_columns)}) est nulle : {removed_rows.shape[0]} lignes")

        return df_cleaned, removed_rows
    
    def drop_duplicates_except(self, df, exclude_columns):
        """
        Supprime les doublons tout en excluant certaines colonnes.
        """
        return df.drop_duplicates(subset=[col for col in df.columns if col not in exclude_columns])


    def clean_montant(self, df, montant_column='montant'):
        
        """Nettoie et transforme la colonne 'montant'."""
        df[montant_column] = df[montant_column].apply(clean_numeros).astype(float)
        df[montant_column] = df[montant_column].map(abs)
        
        return df
    
    def clean_codecpv(self, value):
        """Nettoie la valeur codecpv pour la convertir en chaîne valide."""
        if pd.isna(value):
            return 'Unknown'
        return str(value)
    

    def apply_cleaning(self, df, date_columns=None, id_columns=None):
        """Applique le nettoyage des numéros et la gestion des dates sur un DataFrame."""
        for col, clean_col, siren_col in id_columns:
            df[[clean_col, f"{clean_col}_conversion_type"]] = df[col].apply(lambda x: pd.Series(self.clean_numeros(x)))
            #df[siren_col] = df[clean_col].apply(self.extract_siren_from_siret)
        print('date_columns',date_columns)
        # Nettoyer les dates (dateColumns) pour 'dateConvention', 'datenotification' etc.
        for col, formatted_col, year_col in date_columns:
            print(col)
            df[formatted_col], df[year_col] = self.detect_and_fix_dates(df[col])

        
        return df



class DataUpdater:
    def __init__(self, subventions_final_cleaned, path_to_data,path_to_output):
        self.subventions_final_cleaned = subventions_final_cleaned
        self.path_to_data = path_to_data
        self.df_merged = subventions_final_cleaned
        self.path_to_output = path_to_output


    def read_data(self):
        """Lire les fichiers de données nécessaires."""
        data_naf = pd.read_excel(f'{self.path_to_data}/int_courts_naf_rev_2.xls')
        data_naf = data_naf.loc[~(data_naf['Code'].isna())]
        data_naf.columns = data_naf.columns.str.strip().str.replace(r'\s+', ' ', regex=True)

        categorie_juridique_niv1 = pd.read_excel(f'{self.path_to_data}/cj_septembre_2022.xls', sheet_name="Niveau I", header=3)
        categorie_juridique_niv2 = pd.read_excel(f'{self.path_to_data}/cj_septembre_2022.xls', sheet_name="Niveau II", header=3)
        categorie_juridique_niv3 = pd.read_excel(f'{self.path_to_data}/cj_septembre_2022.xls', sheet_name="Niveau III", header=3)
        data_naf["Code"] = data_naf["Code"].astype(str).str.replace(".", "", regex=False)
        return data_naf, categorie_juridique_niv1, categorie_juridique_niv2, categorie_juridique_niv3



    def merge_siren_data(self, data_naf, categorie_juridique_niv1, categorie_juridique_niv2, categorie_juridique_niv3):
        """Effectuer la fusion et les transformations nécessaires avec les données NAF et juridiques."""
        self.df_merged['naf_subsector_beneficaire'] = self.df_merged['naf8_beneficiaire'].str.extract(r'(\d{2})')


        self.df_merged = self.df_merged.merge(
            data_naf[['Code', 'Intitulés de la NAF rév. 2, version finale']], 
            left_on="naf_subsector_beneficaire", right_on="Code", how="left", suffixes=('', '_drop')
        ).rename(columns={'Intitulés de la NAF rév. 2, version finale': 'naf_subsector_beneficaire'})

        self.df_merged = self.df_merged.merge(
            data_naf[['Code', 'Intitulés NAF rév. 2, en 40 caractères']], 
            left_on="naf8_beneficiaire", right_on="Code", how="left", suffixes=('', '_drop')
        ).rename(columns={'Intitulés NAF rév. 2, en 40 caractères': 'naf_subsubsector_beneficaire'})

        self.df_merged = self.df_merged.drop(columns=['naf_subsector', 'Code', 'Code_drop'], errors='ignore')

        self.df_merged["code_ju_beneficiaire_niv1"] = self.df_merged["code_ju_beneficiaire"].fillna(0).astype(int) // 1000
        self.df_merged["code_ju_beneficiaire_niv2"] = self.df_merged["code_ju_beneficiaire"].fillna(0).astype(int) // 100


        juridical_levels = [
            ('code_ju_beneficiaire_niv1', categorie_juridique_niv1, 'niv1'),
            ('code_ju_beneficiaire_niv2', categorie_juridique_niv2, 'niv2'),
            ('code_ju_beneficiaire', categorie_juridique_niv3, 'niv3')
        ]
        
        for col_name, categorie_juridique_data, level in juridical_levels:
            self.df_merged = self.df_merged.merge(
                categorie_juridique_data, 
                left_on=col_name, 
                right_on="Code", 
                how="left"
            )
    
            self.df_merged = self.df_merged.rename(columns={
                'Libellé': f'categorie_ju_beneficiaire_{level}_name'
            })
            
            self.df_merged = self.df_merged.drop(columns=['Code'], errors='ignore')


    def add_naf_section(self, data_naf):
        """Ajouter les sections NAF au DataFrame."""
        data_naf_sector = data_naf[['Code', 'Intitulés NAF rév. 2, en 40 caractères']]

        sections, codes, titles = [], [], []
        current_codes, current_section, current_title = [], None, None

        for _, row in data_naf_sector.iterrows():
            if 'SECTION' in row['Code']:  # Nouvelle section détectée
                if current_codes:
                    codes.append(current_codes)
                    sections.append(current_section)
                    titles.append(current_title)

                current_section = row['Code']
                current_title = row['Intitulés NAF rév. 2, en 40 caractères']
                current_codes = []
            else:
                current_codes.append(row['Code'])

        if current_codes:
            codes.append(current_codes)
            sections.append(current_section)
            titles.append(current_title)

        df_naf_section = pd.DataFrame({
            'SECTION': sections,
            'Intitulés NAF rév. 2, en 40 caractères': titles,
            'Code': codes
        })

        naf_section_mapping = {code: title for codes_list, title in zip(df_naf_section['Code'], df_naf_section['Intitulés NAF rév. 2, en 40 caractères']) for code in codes_list}
        
        self.df_merged['section_naf_beneficiaire'] = self.df_merged['naf8_beneficiaire'].map(naf_section_mapping)

    def update_subventions_data(self):
        """Mettre à jour le DataFrame subventions avec les données NAF, juridiques et siren."""
        # Lire les données nécessaires
        data_naf, categorie_juridique_niv1, categorie_juridique_niv2, categorie_juridique_niv3 = self.read_data()


        # Fusionner les données NAF et juridiques
        self.merge_siren_data(data_naf, categorie_juridique_niv1, categorie_juridique_niv2, categorie_juridique_niv3)

        # Ajouter les sections NAF
        self.add_naf_section(data_naf)

        return self.df_merged


