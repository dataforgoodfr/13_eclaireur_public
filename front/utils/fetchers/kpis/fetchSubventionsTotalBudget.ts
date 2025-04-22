import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.CommunitiesAccount;

export function createSQLQueryParams(year: number): [string, (string | number)[]] {
  const values = [year];
  const querySQL = `
    SELECT SUM(subventions)
    FROM ${TABLE_NAME}
    WHERE annee = $1
  `;

  return [querySQL, values];
}

/**
 * Montant total subventions dans budget
 * @param year
 * @returns
 */
export async function fetchSubventionsTotalBudget(year: number): Promise<number> {
  const params = createSQLQueryParams(year);

  const result = (await getQueryFromPool(...params)) as { sum: number }[];

  return result[0].sum;
}
