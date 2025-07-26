import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.Subventions;

function createSQLQueryParams(siren: string): [string, (string | number)[]] {
  const values = [siren];

  const querySQL = `
    SELECT DISTINCT annee::integer AS year
    FROM ${TABLE_NAME}
    WHERE id_attribuant = $1
    ORDER BY year
  `;

  return [querySQL, values];
}

/**
 * Fetch available years of subventions of a community (SSR)
 */
export async function fetchSubventionsAvailableYears(siren: string): Promise<number[]> {
  const params = createSQLQueryParams(siren);
  const rows = (await getQueryFromPool(...params)) as { year: number }[];

  return rows.map((row) => row.year);
}
