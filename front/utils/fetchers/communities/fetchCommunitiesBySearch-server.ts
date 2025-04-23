import { Community } from '@/app/models/community';
import { getQueryFromPool } from '@/utils/db';

const TABLE_NAME = 'staging_communities';

const ROWS_PER_PAGE = 100;

/**
 * Create the SQL query to search by query and page
 * @param query
 * @param page starts at 1
 * @returns
 */
export function createSQLQueryParams(query: string, page = 1): [string, (string | number)[]] {
  const limit = page * ROWS_PER_PAGE;
  const values = [`%${query}%`, `%${query}%`, limit]; // Values for nom, siren, and limit
  const querySQL = `
    SELECT nom, code_postal, type, siren,
           SIMILARITY(LOWER(nom), LOWER($1)) AS similarity_score
    FROM ${TABLE_NAME}
    WHERE nom ILIKE $2
       OR code_postal::text ILIKE $2
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

  return getQueryFromPool(...params) as Promise<Pick<Community, 'nom' | 'siren' | 'type'>[]>;
}
