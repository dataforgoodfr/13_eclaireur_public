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

print("=" * 80)
print("STATISTIQUES SUR LES VALEURS MAXIMALES DES COMMUNAUTES")
print("=" * 80)

# =============================================================================
# MARCHES PUBLICS - Compter les contrats distincts par collectivité
# =============================================================================
print("\n" + "=" * 80)
print("MARCHES PUBLICS - Top 10 collectivités par nombre de contrats (2023)")
print("=" * 80)

mp_query = """
    SELECT
        acheteur_id as siren,
        COUNT(*) as total_contracts
    FROM (
        SELECT DISTINCT
            acheteur_id,
            id,
            objet,
            montant,
            annee_notification
        FROM pg.public.marches_publics
        WHERE annee_notification = 2023
    ) AS distinct_contracts
    GROUP BY acheteur_id
    ORDER BY total_contracts DESC
    LIMIT 10
"""

mp_result = conn.execute(mp_query).fetchdf()
print(mp_result.to_string(index=False))

print(f"\nMax contrats en 2023: {mp_result['total_contracts'].max()}")
print(f"Min contrats en 2023 (top 10): {mp_result['total_contracts'].min()}")

# Paris stats
print("\n" + "-" * 80)
print("PARIS (217500016) - Évolution des contrats")
print("-" * 80)

paris_query = """
    SELECT
        annee_notification::integer AS year,
        COUNT(*)::integer as count
    FROM (
        SELECT DISTINCT
            id,
            objet,
            montant,
            annee_notification
        FROM pg.public.marches_publics
        WHERE acheteur_id = '217500016'
            AND annee_notification IS NOT NULL
    ) AS distinct_contracts
    GROUP BY annee_notification::integer
    ORDER BY annee_notification::integer ASC
"""

paris_result = conn.execute(paris_query).fetchdf()
print(paris_result.to_string(index=False))

# =============================================================================
# SUBVENTIONS - Compter les subventions distinctes par collectivité
# =============================================================================
print("\n" + "=" * 80)
print("SUBVENTIONS - Top 10 collectivités par nombre de subventions (2023)")
print("=" * 80)

subv_query = """
    SELECT
        id_attribuant as siren,
        COUNT(*) as total_subventions
    FROM (
        SELECT
            id_attribuant,
            id_beneficiaire,
            objet,
            annee
        FROM pg.public.subventions
        WHERE annee = 2023
        GROUP BY
            id_attribuant,
            id_beneficiaire,
            objet,
            annee
    ) AS distinct_subventions
    GROUP BY id_attribuant
    ORDER BY total_subventions DESC
    LIMIT 10
"""

subv_result = conn.execute(subv_query).fetchdf()
print(subv_result.to_string(index=False))

print(f"\nMax subventions en 2023: {subv_result['total_subventions'].max()}")
print(f"Min subventions en 2023 (top 10): {subv_result['total_subventions'].min()}")

# Fermer la connexion
conn.close()
