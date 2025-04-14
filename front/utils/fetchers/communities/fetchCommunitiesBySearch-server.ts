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
  const values = [query, query, `%${query}%`, `%${query}%`, limit]; // exact nom, exact cp, partial nom, partial cp, limit
  const querySQL = `
    SELECT nom, code_postal, type, siren
    FROM ${TABLE_NAME}
    WHERE unaccent(nom) ILIKE $3
      OR code_postal::text ILIKE $4
    ORDER BY
      CASE
        WHEN unaccent(nom) = $1 THEN 1
        WHEN code_postal::text = $2 THEN 2
        ELSE 3
      END,
      unaccent(nom) ASC
    LIMIT $5
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
