import { Community } from '@/app/models/community';
import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';

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
  const exactQuery = query;
  const partialQuery = `%${query}%`;
  const values = [exactQuery, partialQuery, limit];

  // TODO - remove casting of code_postal_x when renamed in the db
  const querySQL = `
    SELECT nom, code_postal_x as code_postal, type, siren,
           SIMILARITY(LOWER(nom), LOWER($1)) AS similarity_score
    FROM ${TABLE_NAME}
    WHERE nom ILIKE $2
       OR code_postal_x::text ILIKE $2
    ORDER BY similarity_score DESC
    LIMIT $3;
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

  return getQueryFromPool(...params) as Promise<
    Pick<Community, 'nom' | 'siren' | 'type' | 'code_postal'>[]
  >;
}
