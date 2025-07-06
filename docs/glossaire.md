# Glossaire

## Sources et références institutionnelles

- **OFGL (Observatoire des Finances et de la Gestion Locale)**  
  Organisme qui collecte et publie des données financières détaillées sur les collectivités territoriales : communes, intercommunalités, départements et régions. Ces données permettent d’analyser la gestion budgétaire locale.

- **ODF (Open Data France)**  
  Plateforme fédérant les données ouvertes publiées par les collectivités territoriales. C’est une source importante pour accéder à des jeux de données publics variés.

- **INSEE / Base SIRENE**  
  L’INSEE produit des statistiques nationales, notamment via la base SIRENE qui recense toutes les entités légales (entreprises, administrations, collectivités) identifiées par leur numéro SIRET ou SIREN.

- **Data.gouv.fr**  
  Portail officiel de l’État français dédié à la mise à disposition des données publiques ouvertes (open data). Il rassemble un grand nombre de jeux de données utiles au projet.

- **Geolocator**  
  Classe qui enrichit un DataFrame d'entités géographiques (communes, départements, EPCI, etc.) avec leurs coordonnées (longitude/latitude). Elle s'appuie sur les codes INSEE ou SIREN pour récupérer les centroïdes via une API officielle ou des fichiers GeoJSON.

## Concepts et outils techniques

- **Pipeline / Workflow de traitement**  
  Série d’étapes automatisées enchaînées pour collecter, nettoyer, fusionner, enrichir et normaliser des données issues de différentes sources, afin de produire un jeu final cohérent et exploitable.

- **Data Normalization (Normalisation des données)**  
  Processus visant à uniformiser les formats, noms et structures des données afin de faciliter leur exploitation et comparaison.

- **Subventions territoriales**  
  Aides financières accordées par les collectivités locales à des associations ou projets, souvent suivies et analysées à travers les données publiques.

- **Marchés publics**  
  Contrats passés par les collectivités avec des fournisseurs ou prestataires pour répondre à leurs besoins. Ces données font partie des sources analysées.

- **Aggregation / Agrégation**  
  Action de regrouper plusieurs sources ou fichiers de données pour constituer un ensemble global plus complet et structuré.

- **CPV (Common Procurement Vocabulary)**  
  Vocabulaire standardisé utilisé pour classifier les marchés publics, facilitant la recherche et l’analyse des appels d’offres.

- **Formats de fichiers (Parquet, CSV, JSON)**  
  Différents formats pour stocker les données :  
  - **CSV** : format texte simple, largement utilisé mais moins optimisé pour de gros volumes.  
  - **Parquet** : format binaire performant, adapté aux gros datasets et analyses rapides.  
  - **JSON** : format structuré, souvent utilisé pour les données semi-structurées.

- **Topic Aggregator**  
  Classe qui permet de standardiser des jeux de données issus de collectivités, souvent mal structurés ou non homogènes. Elle applique un modèle de référence afin de faciliter l’agrégation, la comparaison et l’exploitation des données.

- **Single URLs / Datafiles**  
  Sources de données individuelles non centralisées, récupérées directement via des URLs spécifiques.

## Acteurs et utilisateurs

- **Élus locaux**  
  Maires, conseillers municipaux et autres décideurs territoriaux qui utilisent ces données pour piloter et évaluer leurs politiques publiques.

- **Collectivités territoriales**  
  Communes, intercommunalités, départements et régions concernées par la gestion, publication et exploitation des données.

- **Associations subventionnées**  
  Organismes recevant des aides publiques dont les informations sont suivies via les données de subventions.

