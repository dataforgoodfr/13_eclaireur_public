import { Bareme } from '#app/models/bareme';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const COMMUNITIES_TABLE_NAME = DataTable.Communities;
const BAREME_TABLE_NAME = DataTable.Bareme;

function createSQLQueryParams(siren: string, year: number): [string, (string | number)[]] {
  const values = [siren, year];

  const querySQL = `
      SELECT 
        c.siren,
        '$2' as annee, 
        b.subventions_score,
        b.mp_score
      FROM ${COMMUNITIES_TABLE_NAME} c
      LEFT JOIN ${BAREME_TABLE_NAME} b on b.siren = c.siren and b.annee = $2
      WHERE c.siren = $1 
  `;

  return [querySQL, values];
}

/**
 * Fetch the transparency score of a community for a given year
 */
export async function fetchTransparencyScore(siren: string, year: number): Promise<Bareme> {
  const params = createSQLQueryParams(siren, year);
  const rows = (await getQueryFromPool(...params)) as Bareme[];

  return rows[0];
}

/**
 * Fetch the most recent transparency score for a community with aggregated score
 */
export async function fetchMostRecentTransparencyScore(siren: string): Promise<{
  bareme: Bareme | null;
  evolutionGlobalScore: string | null;
}> {
  const querySQL = `
    SELECT 
      c.siren,
      b.annee, 
      b.subventions_score,
      b.mp_score,
      b.evolution_global_score,
      b.global_score
    FROM ${COMMUNITIES_TABLE_NAME} c
    LEFT JOIN ${BAREME_TABLE_NAME} b on b.siren = c.siren
    WHERE c.siren = $1 
    ORDER BY b.annee DESC
    LIMIT 1
  `;

  const rows = (await getQueryFromPool(querySQL, [siren])) as Bareme[];
  const bareme = rows[0] || null;

  return { bareme, evolutionGlobalScore: bareme?.evolution_global_score || null };
}
