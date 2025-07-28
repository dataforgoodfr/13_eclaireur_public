# /// script
# requires-python = ">=3.8"
# dependencies = [
#   "duckdb",
#   "python-dotenv",
#   "pandas",
# ]

import duckdb
import os
from dotenv import load_dotenv
import pandas as pd

# Charger les variables d'environnement
load_dotenv('.env.local')

# Configuration de la connexion PostgreSQL
pg_config = {
    'host': os.getenv('POSTGRESQL_ADDON_HOST'),
    'port': os.getenv('POSTGRESQL_ADDON_PORT', '5432'),
    'user': os.getenv('POSTGRESQL_ADDON_USER'),
    'password': os.getenv('POSTGRESQL_ADDON_PASSWORD'),
    'database': os.getenv('POSTGRESQL_ADDON_DB')
}

# Créer une connexion DuckDB
conn = duckdb.connect()

# Installer et charger l'extension PostgreSQL dans DuckDB
conn.execute("INSTALL postgres")
conn.execute("LOAD postgres")

# Se connecter à PostgreSQL via DuckDB
postgres_dsn = f"postgresql://{pg_config['user']}:{pg_config['password']}@{pg_config['host']}:{pg_config['port']}/{pg_config['database']}"

# Attacher la base PostgreSQL
conn.execute(f"ATTACH '{postgres_dsn}' AS pg (TYPE POSTGRES)")

# Requête pour joindre collectivites avec bareme pour obtenir les scores
query = """
SELECT DISTINCT
    c.nom as Collectivite,
    c.type,
    c.population,
    b.subventions_score as score_sub,
    b.mp_score as score_marches_pub,
    b.annee
FROM pg.public.collectivites c
LEFT JOIN pg.public.bareme b ON c.siren = b.siren
WHERE c.nom IS NOT NULL
ORDER BY b.annee DESC, c.population DESC
"""

# Exécuter la requête et récupérer les résultats
df = conn.execute(query).fetchdf()

# Pour avoir les scores les plus récents par collectivité
query_recent = """
WITH scores_recents AS (
    SELECT 
        siren,
        subventions_score,
        mp_score,
        annee,
        ROW_NUMBER() OVER (PARTITION BY siren ORDER BY annee DESC) as rn
    FROM pg.public.bareme
    WHERE subventions_score IS NOT NULL OR mp_score IS NOT NULL
)
SELECT 
    c.nom as Collectivite,
    c.type,
    c.population,
    s.subventions_score as score_sub,
    s.mp_score as score_marches_pub,
    s.annee as annee_score
FROM pg.public.collectivites c
LEFT JOIN scores_recents s ON c.siren = s.siren AND s.rn = 1
WHERE c.nom IS NOT NULL
ORDER BY c.population DESC
"""

df_recent = conn.execute(query_recent).fetchdf()

# Afficher les statistiques
print("=== RÉSUMÉ DES DONNÉES (SCORES LES PLUS RÉCENTS) ===")
print(f"Nombre total de collectivités: {len(df_recent)}")
print(f"\nNombre de collectivités avec au moins un score: {len(df_recent[df_recent['score_sub'].notna() | df_recent['score_marches_pub'].notna()])}")

print(f"\nRépartition par type:")
print(df_recent['type'].value_counts())

print(f"\nRépartition des scores subventions:")
print(df_recent['score_sub'].value_counts().sort_index())

print(f"\nRépartition des scores marchés publics:")
print(df_recent['score_marches_pub'].value_counts().sort_index())

# Afficher les 30 premières collectivités avec scores
print("\n=== 30 PLUS GRANDES COLLECTIVITÉS AVEC LEURS SCORES ===")
df_with_scores = df_recent[df_recent['score_sub'].notna() | df_recent['score_marches_pub'].notna()]
print(df_with_scores.head(30).to_string(index=False))

# Sauvegarder dans un fichier CSV
output_file = "collectivites_avec_scores.csv"
df_recent.to_csv(output_file, index=False, encoding='utf-8')
print(f"\n✓ Données exportées dans {output_file}")

# Statistiques par type de collectivité
print("\n=== MOYENNES DES SCORES PAR TYPE ===")
for type_col in df_recent['type'].unique():
    if type_col:
        df_type = df_recent[df_recent['type'] == type_col]
        df_type_scores = df_type[df_type['score_sub'].notna() | df_type['score_marches_pub'].notna()]
        if len(df_type_scores) > 0:
            print(f"\n{type_col}:")
            print(f"  - Nombre total: {len(df_type)}")
            print(f"  - Avec scores: {len(df_type_scores)} ({len(df_type_scores)/len(df_type)*100:.1f}%)")
            print(f"  - Répartition scores subventions: {df_type_scores['score_sub'].value_counts().sort_index().to_dict()}")
            print(f"  - Répartition scores marchés publics: {df_type_scores['score_marches_pub'].value_counts().sort_index().to_dict()}")

# Fermer la connexion
conn.close()