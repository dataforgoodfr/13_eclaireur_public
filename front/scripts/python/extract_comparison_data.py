# /// script
# requires-python = ">=3.8"
# dependencies = [
#   "duckdb",
#   "python-dotenv",
#   "pandas",
# ]
# ///
import os
import sys
from typing import List, Dict, Any, Optional

import duckdb
import pandas as pd
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

def validate_config():
    """Valider la configuration de la base de données"""
    missing = [key for key, value in pg_config.items() if not value]
    if missing:
        print(f"❌ Variables d'environnement manquantes: {', '.join(missing)}")
        print("Assurez-vous que le fichier .env.local contient toutes les variables PostgreSQL nécessaires.")
        sys.exit(1)

def setup_connection():
    """Configurer et retourner la connexion DuckDB avec PostgreSQL"""
    conn = duckdb.connect()
    conn.execute("INSTALL postgres")
    conn.execute("LOAD postgres")
    
    postgres_dsn = f"postgresql://{pg_config['user']}:{pg_config['password']}@{pg_config['host']}:{pg_config['port']}/{pg_config['database']}"
    conn.execute(f"ATTACH '{postgres_dsn}' AS pg (TYPE POSTGRES)")
    
    return conn

def get_community_info(conn: duckdb.DuckDBPyConnection, siren: str) -> Optional[Dict[str, Any]]:
    """Récupérer les informations de base d'une collectivité"""
    query = """
    SELECT 
        nom,
        type,
        population,
        code_insee_region,
        code_insee_dept
    FROM pg.public.collectivites
    WHERE siren = $1
    """
    
    result = conn.execute(query, [siren]).fetchone()
    if not result:
        return None
    
    return {
        "nom": result[0],
        "type": result[1],
        "population": result[2],
        "code_insee_region": result[3],
        "code_insee_dept": result[4]
    }

def get_marches_publics_comparison_data(
    conn: duckdb.DuckDBPyConnection, 
    siren: str, 
    scope: str = "régional"
) -> List[Dict[str, Any]]:
    """
    Extraire les données de comparaison des marchés publics
    
    Args:
        conn: Connexion DuckDB
        siren: SIREN de la collectivité
        scope: Niveau de comparaison ('régional', 'départemental', 'national')
    """
    
    community_info = get_community_info(conn, siren)
    if not community_info:
        print(f"❌ Collectivité avec SIREN {siren} introuvable")
        return []
    
    # Définir les critères de comparaison selon le scope
    if scope.lower() == "régional":
        scope_condition = f"code_insee_region = '{community_info['code_insee_region']}'"
    elif scope.lower() == "départemental":
        scope_condition = f"code_insee_dept = '{community_info['code_insee_dept']}'"
    else:  # national
        scope_condition = "1=1"  # Toutes les collectivités
    
    # Requête pour obtenir les données de comparaison par année
    query = f"""
    WITH community_data AS (
        -- Données de la collectivité cible
        SELECT 
            mp.annee_notification as year,
            SUM(mp.montant) as community_amount,
            COUNT(*) as community_count
        FROM pg.public.marches_publics mp
        WHERE mp.acheteur_id = $1
        AND mp.annee_notification IS NOT NULL
        AND mp.montant IS NOT NULL
        GROUP BY mp.annee_notification
    ),
    comparable_communities AS (
        -- Collectivités comparables selon le scope
        SELECT siren
        FROM pg.public.collectivites
        WHERE {scope_condition}
        AND type = $2
        AND siren != $1
    ),
    regional_data AS (
        -- Données moyennes des collectivités comparables
        SELECT 
            mp.annee_notification as year,
            AVG(yearly_amounts.total_amount) as regional_avg_amount,
            AVG(yearly_amounts.total_count) as regional_avg_count
        FROM (
            SELECT 
                mp.acheteur_id,
                mp.annee_notification,
                SUM(mp.montant) as total_amount,
                COUNT(*) as total_count
            FROM pg.public.marches_publics mp
            INNER JOIN comparable_communities cc ON mp.acheteur_id = cc.siren
            WHERE mp.annee_notification IS NOT NULL
            AND mp.montant IS NOT NULL
            GROUP BY mp.acheteur_id, mp.annee_notification
        ) yearly_amounts
        INNER JOIN pg.public.marches_publics mp ON yearly_amounts.acheteur_id = mp.acheteur_id 
            AND yearly_amounts.annee_notification = mp.annee_notification
        GROUP BY mp.annee_notification
    )
    SELECT 
        cd.year::TEXT as year,
        COALESCE(cd.community_amount, 0)::BIGINT as community,
        COALESCE(rd.regional_avg_amount, 0)::BIGINT as regional,
        $3 as communityLabel,
        $4 as regionalLabel
    FROM community_data cd
    LEFT JOIN regional_data rd ON cd.year = rd.year
    WHERE cd.year >= 2020  -- Limiter aux années récentes
    ORDER BY cd.year
    """
    
    community_label = f"Budget de {community_info['nom']}"
    regional_label = f"Moyenne {scope.lower()}e des collectivités {community_info['type'].lower()}s"
    
    try:
        result = conn.execute(query, [
            siren, 
            community_info['type'], 
            community_label, 
            regional_label
        ]).fetchall()
        
        return [
            {
                "year": row[0],
                "community": row[1],
                "communityLabel": row[3],
                "regional": row[2],
                "regionalLabel": row[4]
            }
            for row in result
        ]
    except Exception as e:
        print(f"❌ Erreur lors de l'exécution de la requête: {e}")
        return []

def export_comparison_data(data: List[Dict[str, Any]], siren: str, scope: str) -> str:
    """Exporter les données de comparaison au format CSV"""
    if not data:
        print("⚠️ Aucune donnée à exporter")
        return ""
    
    df = pd.DataFrame(data)
    filename = f"marches_publics_comparison_{siren}_{scope.lower()}.csv"
    df.to_csv(filename, index=False, encoding='utf-8')
    
    return filename

def main():
    print("=== EXTRACTEUR DE DONNÉES DE COMPARAISON ===\n")
    
    # Validation de la configuration
    validate_config()
    
    # Demander les paramètres à l'utilisateur
    siren = input("SIREN de la collectivité (ex: 200046977): ").strip()
    if not siren:
        print("❌ SIREN requis")
        sys.exit(1)
    
    print("\nNiveaux de comparaison disponibles:")
    print("1. Régional")
    print("2. Départemental") 
    print("3. National")
    
    scope_choice = input("\nChoisissez un niveau (1-3, défaut: 1): ").strip() or "1"
    scope_map = {"1": "Régional", "2": "Départemental", "3": "National"}
    scope = scope_map.get(scope_choice, "Régional")
    
    print(f"\n🔍 Extraction des données de comparaison {scope.lower()}e pour le SIREN {siren}...")
    
    # Configurer la connexion
    try:
        conn = setup_connection()
        print("✓ Connexion à la base de données établie")
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        sys.exit(1)
    
    try:
        # Extraire les données
        data = get_marches_publics_comparison_data(conn, siren, scope)
        
        if not data:
            print("❌ Aucune donnée trouvée pour cette collectivité")
            return
        
        # Afficher les résultats
        print(f"\n=== DONNÉES DE COMPARAISON ({scope.upper()}) ===")
        print(f"Collectivité: {data[0]['communityLabel']}")
        print(f"Comparaison: {data[0]['regionalLabel']}")
        print(f"Nombre d'années: {len(data)}")
        
        print("\n📊 Données par année:")
        print("-" * 80)
        print(f"{'Année':<6} | {'Collectivité':<15} | {'Moyenne':<15} | {'Différence':<15}")
        print("-" * 80)
        
        for row in data:
            diff = row['community'] - row['regional']
            diff_sign = "+" if diff >= 0 else ""
            print(f"{row['year']:<6} | {row['community']:>12,} € | {row['regional']:>12,} € | {diff_sign}{diff:>12,} €")
        
        # Exporter au format CSV
        filename = export_comparison_data(data, siren, scope)
        if filename:
            print(f"\n✓ Données exportées dans {filename}")
        
        # Statistiques générales
        amounts = [row['community'] for row in data]
        regional_amounts = [row['regional'] for row in data]
        
        print(f"\n=== STATISTIQUES GÉNÉRALES ===")
        print(f"Budget moyen de la collectivité: {sum(amounts)/len(amounts):,.0f} €")
        print(f"Budget moyen {scope.lower()}: {sum(regional_amounts)/len(regional_amounts):,.0f} €")
        
        above_avg = sum(1 for row in data if row['community'] > row['regional'])
        print(f"Années au-dessus de la moyenne {scope.lower()}e: {above_avg}/{len(data)}")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'extraction: {e}")
    finally:
        conn.close()
        print("\n🔐 Connexion fermée")

if __name__ == "__main__":
    main()