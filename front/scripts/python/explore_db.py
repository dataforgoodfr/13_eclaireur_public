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

print("=== TABLES DANS LA BASE POSTGRESQL ===\n")

# Lister toutes les tables
tables = conn.execute("""
    SELECT table_schema, table_name 
    FROM pg.information_schema.tables 
    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    ORDER BY table_schema, table_name
""").fetchall()

print(f"Nombre total de tables: {len(tables)}\n")

for schema, table in tables:
    print(f"- {schema}.{table}")

print("\n=== EXPLORATION DES DONNÉES ===\n")

# Pour chaque table, afficher le nombre de lignes et les colonnes
for schema, table in tables:
    print(f"\nTable: {schema}.{table}")
    print("-" * 50)
    
    try:
        # Compter les lignes
        count = conn.execute(f"SELECT COUNT(*) FROM pg.{schema}.{table}").fetchone()[0]
        print(f"Nombre de lignes: {count}")
        
        # Lister les colonnes
        columns = conn.execute(f"""
            SELECT column_name, data_type 
            FROM pg.information_schema.columns 
            WHERE table_schema = '{schema}' AND table_name = '{table}'
            ORDER BY ordinal_position
        """).fetchall()
        
        print("\nColonnes:")
        for col_name, col_type in columns:
            print(f"  - {col_name}: {col_type}")
        
        # Afficher un échantillon de données si la table n'est pas vide
        if count > 0:
            print(f"\nÉchantillon (5 premières lignes):")
            sample = conn.execute(f"SELECT * FROM pg.{schema}.{table} LIMIT 5").fetchdf()
            print(sample.to_string())
            
    except Exception as e:
        print(f"Erreur lors de l'exploration de la table: {e}")

# Fermer la connexion
conn.close()