import { Subvention, PaginatedSubvention } from '#app/models/subvention';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';
import { Pagination } from '../types';

const TABLE_NAME = DataTable.MarchesPublics;

function createSQLQueryParams(
  siren: string,
  year: number | null,
  pagination: Pagination,
  by: keyof Subvention,
): [string, (string | number)[]] {
  const values: (string | number)[] = [siren];

  let query = `
    SELECT 
      id_beneficiaire, 
      objet, 
      montant, 
      annee,
      ARRAY_AGG(nom_beneficiaire) AS beneficiaire_names,
      count(*) OVER()::integer AS total_row_count
    FROM ${TABLE_NAME}
    WHERE id_attribuant = $1`;

  if (year !== null) {
    query += ` AND annee = $${values.length + 1}`;
    values.push(year);
  }

  query += `
    GROUP BY 
      id_beneficiaire, 
      objet, 
      montant,
      annee
    ORDER BY ${by} DESC
    `;

  const { limit, page } = pagination;

  query += ` LIMIT $${values.length + 1} OFFSET ($${values.length + 2} - 1) * $${values.length + 1}`;
  values.push(...[limit, page]);

  return [query, values];
}

const DEFAULT_BY: keyof Subvention = 'montant';

/**
 * Fetch the marches publics paginated (SSR) with pagination
 * Default by montant
 */
export async function fetchSubventionPaginated(
  siren: string,
  year: number | null,
  pagination: Pagination,
  by = DEFAULT_BY,
): Promise<PaginatedSubvention[]> {
  const params = createSQLQueryParams(siren, year, pagination, by);
  const rows = (await getQueryFromPool(...params)) as PaginatedSubvention[];

  return rows;
}
