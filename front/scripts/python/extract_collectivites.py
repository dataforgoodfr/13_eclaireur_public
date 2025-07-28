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

# Requête pour extraire les données demandées
query = """
SELECT 
    nom as Collectivite,
    type,
    population,
    subventions_score as score_sub,
    mp_score as score_marches_pub
FROM pg.public.collectivites
WHERE nom IS NOT NULL
ORDER BY population DESC
"""

# Exécuter la requête et récupérer les résultats dans un DataFrame
df = conn.execute(query).fetchdf()

# Afficher les statistiques
print("=== RÉSUMÉ DES DONNÉES ===")
print(f"Nombre total de collectivités: {len(df)}")
print(f"\nRépartition par type:")
print(df['type'].value_counts())
print(f"\nRépartition des scores subventions:")
print(df['score_sub'].value_counts())
print(f"\nRépartition des scores marchés publics:")
print(df['score_marches_pub'].value_counts())

# Afficher les 20 premières collectivités
print("\n=== 20 PLUS GRANDES COLLECTIVITÉS ===")
print(df.head(20).to_string(index=False))

# Sauvegarder dans un fichier CSV
output_file = "collectivites_scores.csv"
df.to_csv(output_file, index=False)
print(f"\n✓ Données exportées dans {output_file}")

# Fermer la connexion
conn.close()