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
print("MAXIMUM VALUES ACROSS ALL COMMUNITIES - ALL YEARS")
print("=" * 80)

# =============================================================================
# MARCHES PUBLICS - Max par année pour toutes les collectivités
# =============================================================================
print("\n" + "=" * 80)
print("MARCHES PUBLICS - Maximum contracts per community per year")
print("=" * 80)

mp_max_query = """
    WITH contract_counts AS (
        SELECT
            acheteur_id as siren,
            annee_notification::integer as year,
            COUNT(*) as total_contracts
        FROM (
            SELECT DISTINCT
                acheteur_id,
                id,
                objet,
                montant,
                annee_notification
            FROM pg.public.marches_publics
            WHERE annee_notification IS NOT NULL
        ) AS distinct_contracts
        GROUP BY acheteur_id, annee_notification::integer
    )
    SELECT
        year,
        MAX(total_contracts) as max_contracts,
        MIN(total_contracts) as min_contracts,
        AVG(total_contracts)::integer as avg_contracts,
        COUNT(DISTINCT siren) as num_communities
    FROM contract_counts
    GROUP BY year
    ORDER BY year DESC
    LIMIT 10
"""

mp_max_result = conn.execute(mp_max_query).fetchdf()
print(mp_max_result.to_string(index=False))

print("\n" + "-" * 80)
print("Top community per year:")
print("-" * 80)

mp_top_per_year = """
    WITH contract_counts AS (
        SELECT
            acheteur_id as siren,
            annee_notification::integer as year,
            COUNT(*) as total_contracts
        FROM (
            SELECT DISTINCT
                acheteur_id,
                id,
                objet,
                montant,
                annee_notification
            FROM pg.public.marches_publics
            WHERE annee_notification IS NOT NULL
        ) AS distinct_contracts
        GROUP BY acheteur_id, annee_notification::integer
    ),
    ranked AS (
        SELECT
            year,
            siren,
            total_contracts,
            ROW_NUMBER() OVER (PARTITION BY year ORDER BY total_contracts DESC) as rank
        FROM contract_counts
    )
    SELECT
        year,
        siren,
        total_contracts
    FROM ranked
    WHERE rank = 1
    ORDER BY year DESC
    LIMIT 10
"""

mp_top_result = conn.execute(mp_top_per_year).fetchdf()
print(mp_top_result.to_string(index=False))

# =============================================================================
# SUBVENTIONS - Max par année pour toutes les collectivités
# =============================================================================
print("\n" + "=" * 80)
print("SUBVENTIONS - Maximum subventions per community per year")
print("=" * 80)

subv_max_query = """
    WITH subvention_counts AS (
        SELECT
            id_attribuant as siren,
            annee::integer as year,
            COUNT(*) as total_subventions
        FROM (
            SELECT
                id_attribuant,
                id_beneficiaire,
                objet,
                annee
            FROM pg.public.subventions
            WHERE annee IS NOT NULL
            GROUP BY
                id_attribuant,
                id_beneficiaire,
                objet,
                annee
        ) AS distinct_subventions
        GROUP BY id_attribuant, annee::integer
    )
    SELECT
        year,
        MAX(total_subventions) as max_subventions,
        MIN(total_subventions) as min_subventions,
        AVG(total_subventions)::integer as avg_subventions,
        COUNT(DISTINCT siren) as num_communities
    FROM subvention_counts
    GROUP BY year
    ORDER BY year DESC
    LIMIT 10
"""

subv_max_result = conn.execute(subv_max_query).fetchdf()
print(subv_max_result.to_string(index=False))

print("\n" + "-" * 80)
print("Top community per year:")
print("-" * 80)

subv_top_per_year = """
    WITH subvention_counts AS (
        SELECT
            id_attribuant as siren,
            annee::integer as year,
            COUNT(*) as total_subventions
        FROM (
            SELECT
                id_attribuant,
                id_beneficiaire,
                objet,
                annee
            FROM pg.public.subventions
            WHERE annee IS NOT NULL
            GROUP BY
                id_attribuant,
                id_beneficiaire,
                objet,
                annee
        ) AS distinct_subventions
        GROUP BY id_attribuant, annee::integer
    ),
    ranked AS (
        SELECT
            year,
            siren,
            total_subventions,
            ROW_NUMBER() OVER (PARTITION BY year ORDER BY total_subventions DESC) as rank
        FROM subvention_counts
    )
    SELECT
        year,
        siren,
        total_subventions
    FROM ranked
    WHERE rank = 1
    ORDER BY year DESC
    LIMIT 10
"""

subv_top_result = conn.execute(subv_top_per_year).fetchdf()
print(subv_top_result.to_string(index=False))

# =============================================================================
# OVERALL MAXIMUMS
# =============================================================================
print("\n" + "=" * 80)
print("OVERALL MAXIMUM VALUES")
print("=" * 80)

print("\nMarchés Publics:")
print(f"  Highest contracts count (any community, any year): {mp_max_result['max_contracts'].max()}")
print(f"  Year with highest max: {mp_max_result.loc[mp_max_result['max_contracts'].idxmax(), 'year']}")

print("\nSubventions:")
print(f"  Highest subventions count (any community, any year): {subv_max_result['max_subventions'].max()}")
print(f"  Year with highest max: {subv_max_result.loc[subv_max_result['max_subventions'].idxmax(), 'year']}")

# Fermer la connexion
conn.close()
