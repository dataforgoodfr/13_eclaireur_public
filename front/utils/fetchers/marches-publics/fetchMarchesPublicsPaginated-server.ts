import { MarchePublic, PaginationMarchePublic } from '@/app/models/marchePublic';
import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';
import { Pagination } from '../types';

const TABLE_NAME = DataTable.MarchesPublics;

function createSQLQueryParams(
  siren: string,
  year: number | null,
  pagination: Pagination,
  by: keyof MarchePublic,
): [string, (string | number)[]] {
  const values: (string | number)[] = [siren];

  let query = `
    SELECT 
      *,
      count(*) OVER()::integer AS total_row_count
    FROM ${TABLE_NAME}
    WHERE acheteur_id = $1`;

  if (year !== null) {
    query += ` AND annee_notification = $${values.length + 1}`;
    values.push(year);
  }

  query += `
    ORDER BY ${by} DESC
    `;

  const { limit, page } = pagination;

  query += ` LIMIT $${values.length + 1} OFFSET ($${values.length + 2} - 1) * $${values.length + 1}`;
  values.push(...[limit, page]);

  return [query, values];
}

const DEFAULT_BY: keyof MarchePublic = 'montant';

/**
 * Fetch the marches publics paginated (SSR) with pagination
 * Default by montant
 */
export async function fetchMarchesPublicsPaginated(
  siren: string,
  year: number | null,
  pagination: Pagination,
  by = DEFAULT_BY,
): Promise<PaginationMarchePublic[]> {
  const params = createSQLQueryParams(siren, year, pagination, by);
  const rows = (await getQueryFromPool(...params)) as PaginationMarchePublic[];

  return rows;
}
