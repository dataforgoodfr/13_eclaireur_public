import { Subvention } from '#app/models/subvention';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.Subventions;

const ROWS_PER_PAGE = 10;

/**
 * Create the SQL query to get the top subventions by montant
 * @param page starts at 1
 * @returns
 */
export function createSQLQueryParams(limit: number): [string, (string | number)[]] {
  const values = [limit];

  const querySQL = `
    SELECT id_beneficiaire, nom_beneficiaire, SUM(montant) AS total_montant
    FROM ${TABLE_NAME} 
    GROUP BY id_beneficiaire, nom_beneficiaire
    ORDER BY total_montant DESC
    LIMIT $1
`;

  return [querySQL, values];
}

/**
 * Fetch the top subventions by montant (SSR) with pagination
 * @param query
 * @param page starts at 1
 */
export async function fetchTopSubventions(limit = ROWS_PER_PAGE): Promise<Subvention[]> {
  const params = createSQLQueryParams(limit);
  const subventions = (await getQueryFromPool(...params)) as Subvention[];

  return subventions;
}
