import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const BAREME_TABLE = DataTable.Bareme;

// TODO - change mp_score to score_aggrege when in db
export function createSQLQueryParams(year: number): [string, (string | number)[]] {
  const values = [year];
  const querySQL = `
    SELECT COUNT(*)::integer
    FROM ${BAREME_TABLE}
    WHERE annee = $1 AND (mp_score = 'A' OR mp_score = 'B')
  `;

  return [querySQL, values];
}

/**
 * Nombre de collectivités avec un A ou B (score aggrégé)
 * @param year
 * @returns
 */
export async function fetchCommunitiesGoodScoresCount(year: number): Promise<number> {
  const params = createSQLQueryParams(year);

  const result = (await getQueryFromPool(...params)) as { count: number }[];

  return result[0].count;
}
