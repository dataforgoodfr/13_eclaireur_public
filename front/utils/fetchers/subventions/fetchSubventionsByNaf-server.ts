import type { SubventionSector } from '#app/models/subvention';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';
import type { Pagination } from '../types';

const TABLE_NAME = DataTable.Subventions;

/**
 * Create the sql query for the subventions by naf2
 */
export function createSQLQueryParams(
  siren: string,
  year: number | null,
  pagination: Pagination,
  maxAmount?: number | undefined,
): [string, (string | number)[]] {
  const values: (string | number)[] = [siren];

  let query = `
  WITH tableWithNaf2 AS (
    SELECT 
      "Libellé_naf_n2_beneficiaire" AS label, 
      LEFT(naf8_beneficiaire, 2) AS naf2,
      objet,
      montant,
      annee
    FROM ${TABLE_NAME}
    WHERE id_attribuant = $1 AND naf8_beneficiaire IS NOT NULL
  )
  SELECT 
    naf2, 
    label,
    objet,
    SUM(montant) AS montant,
    SUM(SUM(montant)) OVER () AS grand_total,
    count(*) OVER()::integer AS total_row_count
  FROM tableWithNaf2
  `;

  if (year !== null) {
    query += `WHERE annee = $${values.length + 1}`;
    values.push(year);
  }

  query += ' GROUP BY naf2, label, objet';
  if (maxAmount !== undefined) query += ` HAVING SUM(montant) <= ${maxAmount}`;

  query += ' ORDER BY montant DESC';

  const { limit, page } = pagination;

  query += ` LIMIT $${values.length + 1} OFFSET ($${values.length + 2} - 1) * $${values.length + 1}`;
  values.push(...[limit, page]);

  return [query, values];
}

/**
 * Fetch the subventions by section naf (SSR) with pagination
 */
export async function fetchSubventionsByNaf(
  siren: string,
  year: number | null,
  pagination: Pagination,
  maxAmount: number | undefined,
): Promise<SubventionSector[]> {
  const params = createSQLQueryParams(siren, year, pagination, maxAmount);
  const rows = (await getQueryFromPool(...params)) as SubventionSector[];

  return rows;
}
