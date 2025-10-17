import type { MarchePublicSector } from '#app/models/marchePublic';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';
import type { Pagination } from '../types';

const TABLE_NAME = DataTable.MarchesPublics;

/**
 * Create the sql query for the marches publics by cpv 2
 */
export function createSQLQueryParams(
  siren: string,
  year: number | null,
  pagination: Pagination,
  maxAmount?: number | undefined,
): [string, (string | number)[]] {
  const values: (string | number)[] = [siren];

  let query = `
    SELECT 
      cpv_2, 
      cpv_2_label,
      objet,
      SUM(montant_du_marche_public_par_titulaire) AS montant,
      SUM(SUM(montant_du_marche_public_par_titulaire)) OVER () AS grand_total,
      count(*) OVER()::integer AS total_row_count
    FROM ${TABLE_NAME}
    WHERE acheteur_id = $1`;

  if (year !== null) {
    query += ` AND annee_notification = $${values.length + 1}`;
    values.push(year);
  }

  query += ' GROUP BY cpv_2, cpv_2_label, objet';
  if (maxAmount !== undefined) query += ` HAVING SUM(montant_du_marche_public_par_titulaire) <= ${maxAmount}`;

  query += ' ORDER BY montant DESC';

  const { limit, page } = pagination;

  query += ` LIMIT $${values.length + 1} OFFSET ($${values.length + 2} - 1) * $${values.length + 1}`;
  values.push(...[limit, page]);

  return [query, values];
}

/**
 * Fetch the marches publics by sector (SSR) with pagination
 */
export async function fetchMarchesPublicsByCPV2(
  siren: string,
  year: number | null,
  pagination: Pagination,
  maxAmount: number | undefined,
): Promise<MarchePublicSector[]> {
  const params = createSQLQueryParams(siren, year, pagination, maxAmount);
  const rows = (await getQueryFromPool(...params)) as MarchePublicSector[];

  return rows;
}
