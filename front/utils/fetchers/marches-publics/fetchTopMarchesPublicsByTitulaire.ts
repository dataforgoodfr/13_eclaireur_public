import { MarchePublic } from '#app/models/marchePublic';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.MarchesPublics;

const ROWS_PER_PAGE = 10;

/**
 * Create the SQL query to get the top marches publics by montant
 * @param limit
 * @returns
 */
export function createSQLQueryParams(limit: number): [string, (string | number)[]] {
  const values = [limit];

  // TODO - add nom titulaire when in db
  const querySQL = `
    SELECT titulaire_id, SUM(montant) AS total_montant
    FROM ${TABLE_NAME} 
    GROUP BY titulaire_id
    ORDER BY total_montant DESC
    LIMIT $1
`;

  return [querySQL, values];
}

/**
 * Fetch the top marches publics by montant (SSR) with pagination
 * @param limit
 */
export async function fetchTopMarchesPublicsByTitulaire(
  limit = ROWS_PER_PAGE,
): Promise<MarchePublic[]> {
  const params = createSQLQueryParams(limit);
  const marchesPublics = (await getQueryFromPool(...params)) as MarchePublic[];

  return marchesPublics;
}
