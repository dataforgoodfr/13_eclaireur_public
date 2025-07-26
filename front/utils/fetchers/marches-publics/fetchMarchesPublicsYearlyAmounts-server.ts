import { YearlyAmount } from '#app/models/graphs';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.MarchesPublics;

function createSQLQueryParams(siren: string): [string, (string | number)[]] {
  const values = [siren];

  const querySQL = `
    SELECT 
      DISTINCT annee_notification::integer AS year,
      SUM(montant) as amount
    FROM ${TABLE_NAME}
    WHERE acheteur_id = $1
    GROUP by year
    ORDER BY year ASC
  `;

  return [querySQL, values];
}

/**
 * Fetch total marches publics amount of a community for each year (SSR)
 */
export async function fetchMarchesPublicsYearlyAmounts(siren: string): Promise<YearlyAmount[]> {
  const params = createSQLQueryParams(siren);
  const rows = (await getQueryFromPool(...params)) as YearlyAmount[];

  return rows;
}
