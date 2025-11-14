import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.MarchesPublics;
const JOINED_TABLE_NAME = DataTable.Communities;

export function createSQLQueryParams(year: number): [string, (string | number)[]] {
  const values = [year];
  const querySQL = `
    SELECT SUM(mp.montant_du_marche_public_par_titulaire) 
    FROM ${TABLE_NAME} AS mp
    INNER JOIN ${JOINED_TABLE_NAME} AS community ON community.siren = mp.acheteur_id
    WHERE mp.annee_notification = $1
  `;

  return [querySQL, values];
}

/**
 * Montant total marches publics déclarés de manière exploitable
 * @param year
 * @returns
 */
export async function fetchPublishedMarchesPublicsTotal(year: number): Promise<number> {
  const params = createSQLQueryParams(year);

  const result = (await getQueryFromPool(...params)) as { sum: number }[];

  return result[0].sum;
}
