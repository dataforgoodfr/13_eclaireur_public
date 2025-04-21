import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';

const MP_TABLE = DataTable.MarchesPublics;
const COMMUNITIES_TABLE = DataTable.Communities;

// TODO - change dateNotification to annee_notification when db updated
// Still bug on dateNotification
export function createSQLQueryParams(year: number): [string, (string | number)[]] {
  const values = [year];
  const querySQL = `
    WITH mp_siren AS (
        SELECT 
            LEFT(acheteur_id,9) AS acheteur_siren,
            montant,
        FROM ${MP_TABLE} mp
        WHERE DATE_PART('year', dateNotification::date) = $1
    )
    SELECT SUM(mps.montant)
    FROM mp_siren AS mps
    INNER JOIN ${COMMUNITIES_TABLE} c
    ON mps.acheteur_siren = c.siren
  `;

  return [querySQL, values];
}

/**
 * Montant total marchés publics déclarés
 * En ne gardant que les marchés publics inferieur a 1Md
 * @param year
 * @returns
 */
export async function fetchPusblishedMarchesPublicsTotal(year: number): Promise<number> {
  const params = createSQLQueryParams(year);

  const result = (await getQueryFromPool(...params)) as { sum: number }[];

  return result[0].sum;
}
