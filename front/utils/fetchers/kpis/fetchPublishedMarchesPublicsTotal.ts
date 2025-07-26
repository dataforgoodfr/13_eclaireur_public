import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const MP_TABLE = DataTable.MarchesPublics;
const COMMUNITIES_TABLE = DataTable.Communities;

// Pour exclure les marchés publics avec des montants supérieurs à MAX_MP_MONTANT (jugés comme étant des erreurs de saisie)
const MAX_MP_MONTANT = 1_000_000_000;

export function createSQLQueryParams(year: number): [string, (string | number)[]] {
  const values = [year, MAX_MP_MONTANT];
  const query = `
    WITH mp_siren AS (
      SELECT 
          acheteur_id,
          montant
      FROM ${MP_TABLE} mp
      WHERE annee_notification = $1
      AND montant * count_titulaires < $2
    )
    SELECT SUM(mps.montant)
    FROM mp_siren AS mps
    INNER JOIN ${COMMUNITIES_TABLE} c
    ON mps.acheteur_id = c.siren
  `;

  return [query, values];
}

/**
 * Montant total marchés publics déclarés
 * En ne gardant que les marchés publics inferieur a MAX_MP_MONTANT
 * @param year
 * @returns
 */
export async function fetchPublishedMarchesPublicsTotal(year: number): Promise<number> {
  const params = createSQLQueryParams(year);

  const result = (await getQueryFromPool(...params)) as { sum: number }[];

  return result[0].sum;
}
