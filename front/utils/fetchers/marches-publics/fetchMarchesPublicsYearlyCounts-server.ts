import { YearlyCount } from '@/app/models/graphs';
import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.MarchesPublics;

function createSQLQueryParams(siren: string): [string, (string | number)[]] {
  const values = [siren];

  const querySQL = `
    SELECT 
      DISTINCT annee::integer AS year,
      COUNT(*)::integer as count
    FROM ${TABLE_NAME}
    WHERE id_attribuant = $1
    GROUP by year
    ORDER BY year ASC
  `;

  return [querySQL, values];
}

/**
 * Fetch total marches publics count of a community for each year (SSR)
 */
export async function fetchMarchesPublicsYearlyCounts(siren: string): Promise<YearlyCount[]> {
  const params = createSQLQueryParams(siren);
  const rows = (await getQueryFromPool(...params)) as YearlyCount[];

  return rows;
}
