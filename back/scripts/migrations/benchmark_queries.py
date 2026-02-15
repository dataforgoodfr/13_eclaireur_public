"""Benchmark common API queries to measure the impact of database indexes.

Usage:
    # Before creating indexes:
    poetry run python -m back.scripts.migrations.benchmark_queries > benchmark_before.txt

    # After creating indexes (run the ETL or the SQL manually):
    poetry run python -m back.scripts.migrations.benchmark_queries > benchmark_after.txt

    # Then compare the two files to see the improvement.
"""

import os
import time

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME')}"
)

QUERIES = {
    "map_regions": """
        SELECT c.code_insee_region, b.mp_score, b.subventions_score, b.global_score
        FROM collectivites c
        LEFT JOIN bareme b ON c.siren = b.siren AND b.annee = 2024
        WHERE c.code_insee_region IN ('84', '75', '44', '32', '11')
        LIMIT 100
    """,
    "map_communes_by_dept": """
        SELECT c.code_insee, c.nom, b.global_score
        FROM collectivites c
        LEFT JOIN bareme b ON c.siren = b.siren AND b.annee = 2024
        WHERE c.code_insee_dept = '75'
        LIMIT 100
    """,
    "community_search_similarity": """
        SELECT nom, code_postal, type, siren
        FROM collectivites
        WHERE SIMILARITY(UNACCENT(LOWER(nom)), UNACCENT(LOWER('Paris'))) > 0.1
        ORDER BY SIMILARITY(UNACCENT(LOWER(nom)), UNACCENT(LOWER('Paris'))) DESC
        LIMIT 30
    """,
    "marches_by_acheteur": """
        SELECT annee_notification, count(*)
        FROM marches_publics
        WHERE acheteur_id = '213105554'
        GROUP BY annee_notification
    """,
    "marches_paginated": """
        SELECT *
        FROM marches_publics
        WHERE acheteur_id = '213105554' AND annee_notification = 2023
        LIMIT 20
    """,
    "subventions_by_attribuant": """
        SELECT annee, count(*), sum(montant)
        FROM subventions
        WHERE id_attribuant = '213105554'
        GROUP BY annee
    """,
    "subventions_paginated": """
        SELECT *
        FROM subventions
        WHERE id_attribuant = '213105554'
        LIMIT 20
    """,
    "advanced_search": """
        SELECT c.siren, c.nom, c.type, c.population, b.global_score
        FROM collectivites c
        LEFT JOIN bareme b ON c.siren = b.siren AND b.annee = 2024
        WHERE c.nom IS NOT NULL AND c.type = 'commune'
        LIMIT 50
    """,
    "bareme_lookup": """
        SELECT siren, annee, mp_score, subventions_score, global_score
        FROM bareme
        WHERE siren = '213105554' AND annee = 2024
    """,
}

N_RUNS = 5


def benchmark() -> None:
    engine = create_engine(DATABASE_URL)
    print(f"Benchmarking {len(QUERIES)} queries ({N_RUNS} runs each)\n")
    print(f"{'Query':<35} {'Avg (ms)':>10} {'Min (ms)':>10} {'Max (ms)':>10}")
    print("-" * 70)

    with engine.connect() as conn:
        for name, sql in QUERIES.items():
            times = []
            for _ in range(N_RUNS):
                start = time.perf_counter()
                try:
                    conn.execute(text(sql)).fetchall()
                except Exception as exc:
                    print(f"{name:<35} ERROR: {exc}")
                    break
                elapsed = (time.perf_counter() - start) * 1000
                times.append(elapsed)
            else:
                avg = sum(times) / len(times)
                print(f"{name:<35} {avg:>10.1f} {min(times):>10.1f} {max(times):>10.1f}")

    print("\nDone.")


if __name__ == "__main__":
    benchmark()
