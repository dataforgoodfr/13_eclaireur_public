import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.MarchesPublics;

function createSQLQueryParams(siren: string): [string, (string | number)[]] {
  const values = [siren];

  const querySQL = `
    SELECT DISTINCT annee_notification::integer AS year
    FROM ${TABLE_NAME}
    WHERE acheteur_id = $1
    ORDER BY year
  `;

  return [querySQL, values];
}

/**
 * Fetch available years of marches publics of a community (SSR)
 * @param query
 * @param limit
 */
export async function fetchMarchesPublicsAvailableYears(siren: string): Promise<number[]> {
  const params = createSQLQueryParams(siren);
  const rows = (await getQueryFromPool(...params)) as { year: number }[];

  return rows.map((row) => row.year);
}
