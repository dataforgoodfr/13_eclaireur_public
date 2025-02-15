import numpy as np
import pandas as pd
import re


def clean_numeros(value):
    # Si la valeur est NaN ou vide, la laisser telle quelle
    if pd.isna(value) or str(value).strip().lower() in {"non renseigné", "non", "nan", "none", ""}:
        return np.nan  # Remplacer par NaN
    
    # Convertir en chaîne de caractères si ce n'est pas déjà fait
    value = str(value).strip().replace("\xa0", "")  
    
    # Cas 1 : Convertir les nombres en notation scientifique mal écrite (ex: '8,19672E+13' → '81967200000000') Pb si il y a un 0 devant 
    if re.match(r"^\d+,\d+E\+\d+$", value):
        value = value.replace(',', '.')  
        return str(int(float(value)))  
    
    # Cas 2 : Convertir les nombres avec des espaces en chaîne sans espace (ex: '086 257 568 00034' → '08625756800034')
    if re.match(r"^[\d\s]+$", value):
        return value.replace(" ", "")  
    
    # Cas 3 : Convertir les nombres avec des virgules comme séparateurs de décimales (ex: '09869826600028,00' → '09869826600028')
    if re.match(r"^\d+,\d{2}$", value):
        return value.split(",")[0] 
    
    # Cas 4 : Convertir les nombres avec des décimales .0 (ex: '03986982660002.0' → '03986982660002')
    if re.match(r"^\d+\.\d+$", value):
        return value.split('.')[0]  
    
    return value


def classify_id(value, nom_beneficiaire):
    
    def clean_and_check_length(val):
        """Nettoie la valeur et vérifie sa longueur pour déterminer si c'est un SIRET ou SIREN."""
        val_str = str(val).strip()  # Convertir la valeur en string et supprimer les espaces superflus
        
        # Vérifier si la chaîne ne contient que des chiffres
        if val_str.isdigit():
            if len(val_str) == 14:
                return val_str, val_str[:9], 1  # SIRET détecté
            elif len(val_str) == 9:
                return None, val_str, 2  # SIREN détecté
            else:
                return None, None, 0  
        return None, None, 0 
    
    siret, siren, status = clean_and_check_length(value)
    if status == 1 or status == 2:
        return siret, siren, nom_beneficiaire, status  # Cas où value est un SIRET ou SIREN

    # Si 'value' ne correspond à un SIRET ou SIREN, on vérifie 'nom_beneficiaire'
    if not pd.isna(nom_beneficiaire):
        # Si nom_beneficiaire est une chaîne de chiffres, on effectue la même vérification
        siret, siren, status = clean_and_check_length(nom_beneficiaire)
        if status == 1:
            return nom_beneficiaire, None, value, 4  # nom_beneficiaire est un SIRET
        elif status == 2:
            return None, nom_beneficiaire, value, 5  # nom_beneficiaire est un SIREN
    return None, None, nom_beneficiaire, 3  # Si aucune correspondance, retourner nom_beneficiaire tel quel
