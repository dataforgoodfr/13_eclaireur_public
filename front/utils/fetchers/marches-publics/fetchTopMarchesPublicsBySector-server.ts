import { MarchePublic } from '@/app/models/marchePublic';
import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.MarchesPublics;

const ROWS_PER_PAGE = 10;

/**
 * Create the SQL query to get the top marches publics by sector
 * @param limit
 * @returns
 */
function createSQLQueryParams(siren: string, limit: number): [string, (string | number)[]] {
  const values = [siren, limit];

  /*   const querySQL = `
    SELECT cpv_2, cpv_2_label, SUM(montant) AS total_montant, SUM(SUM(montant)) AS total_montant
    FROM ${TABLE_NAME} 
    WHERE acheteur_id = $1
    GROUP BY cpv_2, cpv_2_label
    ORDER BY total_montant DESC
    LIMIT $2
`; */
  const querySQL = `
    SELECT 
      cpv_2, 
      cpv_2_label, 
      SUM(montant) AS total_montant,
      SUM(SUM(montant)) OVER () AS pourcentage_du_total
    FROM ${TABLE_NAME}
    WHERE acheteur_id = $1
    GROUP BY cpv_2, cpv_2_label
    ORDER BY total_montant DESC
    LIMIT $2;
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
  limit = ROWS_PER_PAGE,
): Promise<MarchePublic[]> {
  const params = createSQLQueryParams(siren, limit);
  const marchesPublics = (await getQueryFromPool(...params)) as MarchePublic[];

  return marchesPublics;
}
