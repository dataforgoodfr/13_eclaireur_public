import { ComparisonType } from '@/app/community/[siren]/comparison/[comparedSiren]/components/ComparisonType';
import { MPSubvComparison } from '@/app/models/comparison';
import { getQueryFromPool } from '@/utils/db';

import { DataTable } from '../constants';

const MARCHES_PUBLICS_TABLE_NAME = DataTable.MarchesPublics;
const SUBVENTIONS_TABLE_NAME = DataTable.Subventions;

function createSQLQueryParams(
  siren: string,
  year: number,
  comparisonType: ComparisonType,
): [string, (string | number)[]] {
  const values = [siren, year];
  const tableName = comparisonType == ComparisonType.Marches_Publics ? MARCHES_PUBLICS_TABLE_NAME : SUBVENTIONS_TABLE_NAME;
  const sirenProperty = comparisonType == ComparisonType.Marches_Publics ? "acheteur_id" : "id_attribuant";
  const yearProperty = comparisonType == ComparisonType.Marches_Publics ? "annee_notification" : "annee";
  const labelProperty = comparisonType == ComparisonType.Marches_Publics ? "cpv_2_label" : "objet";

  const querySQL = `
WITH filtered_data AS (
    SELECT
        ${sirenProperty} as siren,
        ${yearProperty} as year,
        montant as amount, 
        ${labelProperty} as label
    FROM
        ${tableName}
    WHERE
        ${sirenProperty} = $1
        AND ${yearProperty}  = $2
),
total_calculations AS (
    SELECT
        siren,
        year,
        SUM(amount) AS total_amount,
        COUNT(*) AS total_number
    FROM
        filtered_data
    GROUP BY
        siren, year
),
top5_data AS (
    SELECT
        label,
        amount AS value
    FROM
        filtered_data
    ORDER BY
        amount DESC
    LIMIT 5
)
SELECT
    tc.siren,
    tc.year,
    tc.total_amount,
    tc.total_number,
    (
        SELECT
            json_agg(
                json_build_object(
                    'label', top5.label,
                    'value', top5.value
                )
            )
        FROM
            top5_data top5
    ) AS top5
FROM
    total_calculations tc;
  `;

  return [querySQL, values];
}

/**
 * Fetch the transparency score of a community for a given year
 */
export async function fetchMPSubvComparison(
  siren: string,
  year: number,
  comparisonType: ComparisonType,
): Promise<MPSubvComparison> {
  const params = createSQLQueryParams(siren, year, comparisonType);
  const rows = (await getQueryFromPool(...params)) as MPSubvComparison[];
  if (rows.length === 0) return <MPSubvComparison>{}
  return rows[0];
}
