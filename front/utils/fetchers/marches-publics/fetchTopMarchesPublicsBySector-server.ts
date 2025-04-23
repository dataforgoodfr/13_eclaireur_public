import { MarchePublicSector } from '@/app/models/marchePublic';
import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.MarchesPublics;

const ROWS_PER_PAGE = 10;

/**
 * Create the SQL query to get the top marches publics by sector
 * @param limit
 * @returns
 */
function createSQLQueryParams(
  siren: string,
  year: number,
  limit: number,
): [string, (string | number)[]] {
  const values = [siren, year, limit];

  const querySQL = `
    SELECT 
      cpv_2, 
      cpv_2_label, 
      SUM(montant) AS montant,
      SUM(SUM(montant)) OVER () AS total_montant
    FROM ${TABLE_NAME}
    WHERE acheteur_id = $1 AND annee_notification = $2
    GROUP BY cpv_2, cpv_2_label
    ORDER BY montant DESC
    LIMIT $3;
  `;

  return [querySQL, values];
}

/**
 * Fetch the top marches publics by sector (SSR) with pagination
 * @param query
 * @param limit
 */
export async function fetchTopMarchesPublicsBySector(
  siren: string,
  year: number,
  limit = ROWS_PER_PAGE,
): Promise<MarchePublicSector[]> {
  const params = createSQLQueryParams(siren, year, limit);
  const marchesPublics = (await getQueryFromPool(...params)) as MarchePublicSector[];

  return marchesPublics;
}
