import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.Subventions;

function createSQLQueryParams(): [string, (string | number)[]] {
  const querySQL = `
    SELECT SUM(montant) AS grand_total
    FROM ${TABLE_NAME} 
`;

  return [querySQL, []];
}

/**
 * Fetch the montant grand total of subventions
 */
export async function fetchSubventionsGrandTotal(): Promise<number> {
  const params = createSQLQueryParams();
  const grandTotalArray = (await getQueryFromPool(...params)) as { grand_total: number }[];

  return grandTotalArray[0].grand_total;
}
