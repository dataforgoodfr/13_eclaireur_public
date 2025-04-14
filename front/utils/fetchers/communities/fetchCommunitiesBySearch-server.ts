import { Community } from '@/app/models/community';
import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';

// TODO - add back nom_unaccented

const TABLE_NAME = DataTable.Communities;

const ROWS_PER_PAGE = 100;

/**
 * Create the SQL query to search by query and page
 * @param query
 * @param page starts at 1
 * @returns
 */
export function createSQLQueryParams(query: string, page = 1): [string, (string | number)[]] {
  const limit = page * ROWS_PER_PAGE;
  const values = [`%${query}%`, limit]; // Values for nom, siren, and limit
  const querySQL = `
    SELECT nom, siren, type 
    FROM ${TABLE_NAME} 
    WHERE nom ILIKE $1
      OR siren ILIKE $1
    LIMIT $2
`;
  return [querySQL, values];
}

/**
 * Fetch the communities (SSR) by query search
 * @param query
 * @param page starts at 1
 */
export async function fetchCommunitiesBySearch(
  query: string,
  page: number,
): Promise<Pick<Community, 'nom' | 'siren'>[]> {
  const params = createSQLQueryParams(query, page);

  return getQueryFromPool(...params) as Promise<Pick<Community, 'nom' | 'siren' | 'type'>[]>;
}
