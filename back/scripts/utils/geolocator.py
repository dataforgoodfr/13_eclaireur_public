import logging
import requests
from pathlib import Path
import pandas as pd
import numpy as np
from io import StringIO
import os
import json 

from scripts.utils.config import get_project_base_path
from scripts.loaders.csv_loader import CSVLoader
from scripts.loaders.excel_loader import ExcelLoader


class GeoLocator:
    """
    GeoLocator is a class that enriches a DataFrame containing regions, departments, EPCI, and communes with geocoordinates.
    It uses the COG (INSEE code) to retrieve the coordinates of the regions, departments, and communes from various sources: CSV & API.
    One external method is available to add geocoordinates to the DataFrame.
    """

    def __init__(self, geo_config):
        self.logger = logging.getLogger(__name__)
        # Load the data only once during the instance initialization
        data_folder = Path(get_project_base_path()) / "data" / "communities" / "scrapped_data" / "geoloc"
        reg_dep_geoloc_filename = "dep_reg_centers.csv" # TODO: To add to config
        reg_dep_geoloc_df = pd.read_csv(data_folder / reg_dep_geoloc_filename, sep=';') # TODO: Use CSVLoader
        if reg_dep_geoloc_df.empty:
            self.reg_dep_geoloc_df = None
        else:
            reg_dep_geoloc_df['cog'] = reg_dep_geoloc_df['cog'].astype(str)
            self.reg_dep_geoloc_df = reg_dep_geoloc_df

        epci_coord_loader = CSVLoader(geo_config["epci_coord_url"])
        self.epci_coord_df = epci_coord_loader.load()

        communes_coord_loader = CSVLoader(geo_config["communes_id_url"])
        self.communes_df = communes_coord_loader.load()
    
    # Internal function to get the coordinates of a commune based on its name and COG
    # TODO: Refactor using loader
    def _get_commune_coordinates(self, city_name, city_code):
        # Retrieve the coordinates via the API from https://adresse.data.gouv.fr/api-doc/adresse, using the INSEE code (COG)
        formatted_city_name = city_name.replace(" ", "+")
        url = f"https://api-adresse.data.gouv.fr/search/?q={formatted_city_name}code={city_code}&type=municipality"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data['features']:
                coordinates = data['features'][0]['geometry']['coordinates']
                self.logger.info(f"Les coordonnées de {city_name} sont {coordinates[0]}, {coordinates[1]}")
                return coordinates[0], coordinates[1] # longitude, latitude
        self.logger.warning(f"Les coordonnées de {city_name} ne sont pas trouvées")
        return None, None

    # Internal function to get the coordinates of a region or department based on its COG and type
    def _get_region_department_coordinates(self, cog, type):
        if self.reg_dep_geoloc_df is not None:
            reg_dep_geoloc = self.reg_dep_geoloc_df.copy()
            # Convert cog to string
            cog = str(cog)
            
            # Get latitude and longitude based on cog & type
            reg_dep_geoloc = reg_dep_geoloc.loc[(reg_dep_geoloc['cog'] == cog) & (reg_dep_geoloc['type'] == type)]
            if not reg_dep_geoloc.empty:
                self.logger.info(f"Les coordonnées de {reg_dep_geoloc['nom'].values[0]} sont {reg_dep_geoloc['latitude'].values[0]}, {reg_dep_geoloc['longitude'].values[0]}")
                return reg_dep_geoloc['longitude'].values[0], reg_dep_geoloc['latitude'].values[0]
            else:
                self.logger.warning(f"Les coordonnées de {cog} de type {type} ne sont pas trouvées")
                return None, None
        else:
            self.logger.warning("Le fichier CSV des coordonnées des régions et départements n'est pas trouvé")
            return None, None

    # Internal function to get the coordinates of an EPCI based on its SIREN
    def _get_epci_coordinates(self, siren):
        # Coordinates are retrieved in 3 steps:
        # 1. siren epci -> siren commune siège via https://www.data.gouv.fr/fr/datasets/base-nationale-sur-les-intercommunalites/ (coordonnees-epci-fp-janv2023-last.xlsx) 
        commune_siege_siren = self.epci_coord_df[self.epci_coord_df['N° SIREN'] == siren]['Commune siège'].str.extract('(\d+)').iloc[0, 0]

        # 2. siren commune-> nom, cog commune via https://www.data.gouv.fr/en/datasets/identifiants-des-collectivites-territoriales-et-leurs-etablissements/ (identifiants-communes-2022.csv)
        communes_df = self.communes_df.copy()
        
        # Cast commune_siege_siren and communes_df 'SIREN' to string
        commune_siege_siren = str(commune_siege_siren)
        communes_df['SIREN'] = communes_df['SIREN'].astype(str)

        # extract nom, cog commune safely
        commune_info_df = communes_df[communes_df['SIREN'] == commune_siege_siren][['nom', 'COG']]
        if commune_info_df.empty:
            self.logger.warning(f"Les coordonnées pour l'EPCI {siren} de la commune siège {commune_siege_siren} ne sont pas trouvées")
            return None, None
        commune_info = communes_df[communes_df['SIREN'] == commune_siege_siren][['nom', 'COG']].iloc[0]

        # 3. nom, cog commune -> commune coordinates via https://adresse.data.gouv.fr/api-doc/adresse using internal function _get_commune_coordinates
        if not commune_info.empty:
            coordinates = self._get_commune_coordinates(commune_info['nom'], commune_info['COG'])
            if coordinates:
                self.logger.info(f"Les coordonnées de l'EPCI {siren} sont celle de la commune siège {commune_siege_siren} : {coordinates[0]}, {coordinates[1]}")
                return coordinates[0], coordinates[1] # longitude, latitude
            else:
                self.logger.warning(f"Les coordonnées de l'EPCI {siren} de la commune siège {commune_siege_siren} ne sont pas trouvées")
                return None, None
    
    # Function to add geocoordinates to a DataFrame containing regions, departments, EPCI, and communes
    def add_geocoordinates(self, data_frame):
        # Loop through the DataFrame and enrich it with coordinates
        # TODO: Refactor to process all regions and departments first, then all communes, then all EPCI (as they are copies of communes' coordinates)
        for index, row in data_frame.iterrows():
            if row['type'] in ['COM']:
                coordinates = self._get_commune_coordinates(row['nom'], row['cog'])
            elif row['type'] in ['REG', 'DEP', 'CTU']:
                coordinates = self._get_region_department_coordinates(row['cog'], row['type'])
            else:
                if row['siren']:
                    coordinates = self._get_epci_coordinates(row['siren'])
                else:
                    coordinates = None, None
                    self.logger.warning(f"Le SIREN de l'EPCI {row['nom']} n'est pas trouvé")
            
            # Set the coordinates in the DataFrame
            if coordinates:
                data_frame.at[index, 'longitude'] = float(str(coordinates[0]).replace(',', '.').replace('None', '')) if coordinates[0] not in [None, 'None'] else None
                data_frame.at[index, 'latitude'] = float(str(coordinates[1]).replace(',', '.').replace('None', '')) if coordinates[1] not in [None, 'None'] else None
            else:
                # If no coordinates are found, set the values to None
                data_frame.at[index, 'longitude'] = None
                data_frame.at[index, 'latitude'] = None

        return data_frame