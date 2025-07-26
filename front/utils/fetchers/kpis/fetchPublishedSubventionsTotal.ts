import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.Subventions;
const JOINED_TABLE_NAME = DataTable.Communities;

export function createSQLQueryParams(year: number): [string, (string | number)[]] {
  const values = [year];
  const querySQL = `
    SELECT SUM(subvention.montant) 
    FROM ${TABLE_NAME} AS subvention
    INNER JOIN ${JOINED_TABLE_NAME} AS community ON community.siren = subvention.id_attribuant
    WHERE subvention.annee = $1
  `;

  return [querySQL, values];
}

/**
 * Montant total subventions déclarées de manière exploitable
 * @param year
 * @returns
 */
export async function fetchPublishedSubventionsTotal(year: number): Promise<number> {
  const params = createSQLQueryParams(year);

  const result = (await getQueryFromPool(...params)) as { sum: number }[];

  return result[0].sum;
}
