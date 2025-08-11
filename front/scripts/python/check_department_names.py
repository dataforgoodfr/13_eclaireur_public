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

print("=== VÉRIFICATION DES NOMS DE DÉPARTEMENTS ===\n")

# Vérifier les noms de départements uniques
print("Noms de départements uniques dans comptes_collectivites:")
dept_names = conn.execute("""
    SELECT DISTINCT dept, nom_dept
    FROM pg.public.comptes_collectivites 
    WHERE nom_dept IS NOT NULL 
    ORDER BY dept
""").fetchall()

print(f"Nombre de départements: {len(dept_names)}\n")

for dept_code, dept_name in dept_names[:20]:  # Afficher les 20 premiers
    print(f"  {dept_code}: {dept_name}")

if len(dept_names) > 20:
    print(f"  ... et {len(dept_names) - 20} autres")

print("\n=== VÉRIFICATION AVEC TABLE COLLECTIVITES ===\n")

# Vérifier s'il y a une relation entre collectivites et comptes_collectivites
print("Échantillon de jointure collectivites <-> comptes_collectivites:")
sample_join = conn.execute("""
    SELECT 
        c.siren,
        c.nom,
        c.code_insee_dept,
        cc.nom_dept
    FROM pg.public.collectivites c
    LEFT JOIN pg.public.comptes_collectivites cc ON c.siren = cc.siren
    WHERE cc.nom_dept IS NOT NULL
    LIMIT 10
""").fetchall()

print("siren | nom | code_insee_dept | nom_dept")
print("-" * 80)
for row in sample_join:
    siren, nom, code_dept, nom_dept = row
    print(f"{siren} | {nom[:30]:30} | {code_dept:15} | {nom_dept}")

# Fermer la connexion
conn.close()