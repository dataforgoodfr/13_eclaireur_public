import { Bareme } from '@/app/models/bareme';
import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.Bareme;

function createSQLQueryParams(siren: string, year: number): [string, (string | number)[]] {
  const values = [siren, year];

  const querySQL = `
      SELECT 
        b.*
      FROM ${TABLE_NAME} b
      WHERE b.siren = $1 AND b.annee = $2
  `;

  return [querySQL, values];
}

/**
 * Fetch the transparency score of a community for a given year
 */
export async function fetchTransparencyScore(siren: string, year: number): Promise<Bareme> {
  const params = createSQLQueryParams(siren, year);
  const rows = (await getQueryFromPool(...params)) as Bareme[];

  return rows[0];
}
