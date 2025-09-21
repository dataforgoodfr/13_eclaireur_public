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

  // If either score is UNKNOWN, return UNKNOWN
  if (subventionsScore === TransparencyScore.UNKNOWN || mpScore === TransparencyScore.UNKNOWN) {
    return TransparencyScore.UNKNOWN;
  }

  const scoreValues: Record<Exclude<TransparencyScore, TransparencyScore.UNKNOWN>, number> = {
    [TransparencyScore.A]: 1,
    [TransparencyScore.B]: 2,
    [TransparencyScore.C]: 3,
    [TransparencyScore.D]: 4,
    [TransparencyScore.E]: 5,
  };
  const valueToScore: Record<number, Exclude<TransparencyScore, TransparencyScore.UNKNOWN>> = {
    1: TransparencyScore.A,
    2: TransparencyScore.B,
    3: TransparencyScore.C,
    4: TransparencyScore.D,
    5: TransparencyScore.E,
  };

  const avgValue = Math.round((scoreValues[subventionsScore] + scoreValues[mpScore]) / 2);

  return valueToScore[avgValue];
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
export async function fetchMostRecentTransparencyScore(siren: string): Promise<{
  bareme: Bareme | null;
  aggregatedScore: TransparencyScore | null;
  evolutionGlobalScore: string | null;
}> {
  const querySQL = `
    SELECT 
      c.siren,
      b.annee, 
      b.subventions_score,
      b.mp_score,
      b.evolution_global_score
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

  return { bareme, aggregatedScore, evolutionGlobalScore: bareme?.evolution_global_score || null };
}
