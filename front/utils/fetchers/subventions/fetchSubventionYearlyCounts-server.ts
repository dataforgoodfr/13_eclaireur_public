import { YearlyCount } from '@/app/models/graphs';
import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.Subventions;

function createSQLQueryParams(siren: string): [string, (string | number)[]] {
  const values = [siren];

  const querySQL = `
    SELECT 
      DISTINCT annee::integer AS year,
      COUNT(*)::integer as count
    FROM ${TABLE_NAME}
    WHERE id_attribuant = $1
    GROUP by year
    ORDER BY year DESC
  `;

  return [querySQL, values];
}

/**
 * Fetch total subventions count of a community for each year (SSR)
 */
export async function fetchSubventionYearlyCounts(siren: string): Promise<YearlyCount[]> {
  const params = createSQLQueryParams(siren);
  const rows = (await getQueryFromPool(...params)) as YearlyCount[];

  return rows;
}
