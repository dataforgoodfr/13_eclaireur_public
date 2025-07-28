import { Bareme } from '#app/models/bareme';
import { TransparencyScore } from '#components/TransparencyScore/constants';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const COMMUNITIES_TABLE_NAME = DataTable.Communities;
const BAREME_TABLE_NAME = DataTable.Bareme;

function createSQLQueryParams(siren: string, year: number): [string, (string | number)[]] {
  const values = [siren, year];

  const querySQL = `
      SELECT 
        c.siren,
        '$2' as annee, 
        b.subventions_score,
        b.mp_score
      FROM ${COMMUNITIES_TABLE_NAME} c
      LEFT JOIN ${BAREME_TABLE_NAME} b on b.siren = c.siren and b.annee = $2
      WHERE c.siren = $1 
  `;

  return [querySQL, values];
}

/**
 * Calculate the aggregated transparency score based on subventions and marchés publics scores
 * Uses the average of the two scores (E=5, D=4, C=3, B=2, A=1)
 */
export function calculateAggregatedScore(
  subventionsScore: TransparencyScore | null,
  mpScore: TransparencyScore | null,
): TransparencyScore | null {
  if (!subventionsScore && !mpScore) return null;
  if (!subventionsScore) return mpScore;
  if (!mpScore) return subventionsScore;

  const scoreValues = { A: 1, B: 2, C: 3, D: 4, E: 5 };
  const valueToScore = { 1: TransparencyScore.A, 2: TransparencyScore.B, 3: TransparencyScore.C, 4: TransparencyScore.D, 5: TransparencyScore.E };
  
  const avgValue = Math.round((scoreValues[subventionsScore] + scoreValues[mpScore]) / 2);
  
  return valueToScore[avgValue as keyof typeof valueToScore];
}

/**
 * Fetch the transparency score of a community for a given year
 */
export async function fetchTransparencyScore(siren: string, year: number): Promise<Bareme> {
  const params = createSQLQueryParams(siren, year);
  const rows = (await getQueryFromPool(...params)) as Bareme[];

  return rows[0];
}

/**
 * Fetch the most recent transparency score for a community with aggregated score
 */
export async function fetchMostRecentTransparencyScore(
  siren: string,
): Promise<{ bareme: Bareme | null; aggregatedScore: TransparencyScore | null }> {
  const querySQL = `
    SELECT 
      c.siren,
      b.annee, 
      b.subventions_score,
      b.mp_score
    FROM ${COMMUNITIES_TABLE_NAME} c
    LEFT JOIN ${BAREME_TABLE_NAME} b on b.siren = c.siren
    WHERE c.siren = $1 
    ORDER BY b.annee DESC
    LIMIT 1
  `;

  const rows = (await getQueryFromPool(querySQL, [siren])) as Bareme[];
  const bareme = rows[0] || null;
  
  const aggregatedScore = bareme 
    ? calculateAggregatedScore(bareme.subventions_score, bareme.mp_score)
    : null;

  return { bareme, aggregatedScore };
}
