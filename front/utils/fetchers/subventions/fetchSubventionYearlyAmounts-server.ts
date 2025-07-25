import { YearlyAmount } from '#app/models/graphs';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.Subventions;

function createSQLQueryParams(siren: string): [string, (string | number)[]] {
  const values = [siren];

  const querySQL = `
    SELECT 
      DISTINCT annee::integer AS year,
      SUM(montant) as amount
    FROM ${TABLE_NAME}
    WHERE id_attribuant = $1
    GROUP by year
    ORDER BY year ASC
  `;

  return [querySQL, values];
}

/**
 * Fetch total subventions amount of a community for each year (SSR)
 */
export async function fetchSubventionYearlyAmounts(siren: string): Promise<YearlyAmount[]> {
  const params = createSQLQueryParams(siren);
  const rows = (await getQueryFromPool(...params)) as YearlyAmount[];

  return rows;
}
