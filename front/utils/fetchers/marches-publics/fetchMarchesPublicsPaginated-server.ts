import { MarchePublic, PaginatedMarchePublic } from '#app/models/marchePublic';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';
import { Pagination } from '../types';

const TABLE_NAME = DataTable.MarchesPublics;

// `by` is interpolated into ORDER BY (identifiers can't be bound as $n params),
// so only allow-listed columns may reach the SQL string.
const SORTABLE_COLUMNS: ReadonlyArray<keyof MarchePublic> = [
  'montant_du_marche_public',
  'annee_notification',
  'objet',
  'id_mp',
];

function safeOrderBy(by: unknown): keyof MarchePublic {
  return SORTABLE_COLUMNS.includes(by as keyof MarchePublic)
    ? (by as keyof MarchePublic)
    : DEFAULT_BY;
}

function createSQLQueryParams(
  siren: string,
  year: number | null,
  pagination: Pagination,
  by: keyof MarchePublic,
): [string, (string | number)[]] {
  const values: (string | number)[] = [siren];

  let query = `
    SELECT
      id_mp,
      objet,
      montant_du_marche_public,
      annee_notification,
      ARRAY_AGG(titulaire_denomination_sociale) AS titulaire_names,
      count(*) OVER()::integer AS total_row_count
    FROM ${TABLE_NAME}
    WHERE acheteur_id = $1`;

  if (year !== null) {
    query += ` AND annee_notification = $${values.length + 1}`;
    values.push(year);
  }

  query += `
    GROUP BY 
      id_mp, 
      objet, 
      montant_du_marche_public,
      annee_notification
    ORDER BY ${safeOrderBy(by)} DESC
    `;

  const { limit, page } = pagination;

  query += ` LIMIT $${values.length + 1} OFFSET ($${values.length + 2} - 1) * $${values.length + 1}`;
  values.push(...[limit, page]);

  return [query, values];
}

const DEFAULT_BY: keyof MarchePublic = 'montant_du_marche_public';

/**
 * Fetch the marches publics paginated (SSR) with pagination
 * Default by montant_du_marche_public
 */
export async function fetchMarchesPublicsPaginated(
  siren: string,
  year: number | null,
  pagination: Pagination,
  by = DEFAULT_BY,
): Promise<PaginatedMarchePublic[]> {
  const params = createSQLQueryParams(siren, year, pagination, by);
  const rows = (await getQueryFromPool(...params)) as PaginatedMarchePublic[];

  return rows;
}
