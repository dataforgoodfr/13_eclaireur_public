import { getQueryFromPool } from '#utils/db';

/**
 * Renvoie le dernier total_produits (budget total) pour une collectivité.
 * On prend la dernière année disponible.
 */
export async function fetchCommunityBudgetTotal(siren: string): Promise<number | null> {
  const sql = `
    SELECT total_produits AS budget_total
    FROM comptes_collectivites
    WHERE siren = $1
    ORDER BY annee DESC
    LIMIT 1
  `;
  const rows = await getQueryFromPool(sql, [siren]);
  return rows?.[0]?.budget_total ?? null;
}
