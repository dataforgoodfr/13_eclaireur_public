# /// script
# requires-python = ">=3.8"
# dependencies = [
#   "duckdb",
#   "python-dotenv",
#   "pandas",
# ]
# ///
import os

import duckdb
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv(".env.local")

# Configuration de la connexion PostgreSQL
pg_config = {
    "host": os.getenv("POSTGRESQL_ADDON_HOST"),
    "port": os.getenv("POSTGRESQL_ADDON_PORT", "5432"),
    "user": os.getenv("POSTGRESQL_ADDON_USER"),
    "password": os.getenv("POSTGRESQL_ADDON_PASSWORD"),
    "database": os.getenv("POSTGRESQL_ADDON_DB"),
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

print("=== SCHEMA TABLE SUBVENTIONS ===\n")

# Lister les colonnes de la table subventions
columns = conn.execute("""
    SELECT column_name, data_type
    FROM pg.information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subventions'
    ORDER BY ordinal_position
""").fetchall()

print("Colonnes de la table subventions:")
for col_name, col_type in columns:
    print(f"  - {col_name}: {col_type}")

# Afficher un échantillon
print("\n=== ECHANTILLON (5 lignes) ===\n")
sample = conn.execute("SELECT * FROM pg.public.subventions LIMIT 5").fetchdf()
print(sample.to_string())

# Fermer la connexion
conn.close()
