import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.Communities;

export function createSQLQueryParams(): [string, (string | number)[]] {
  const querySQL = `
    SELECT COUNT(DISTINCT c.siren)
    FROM ${TABLE_NAME} AS c
  `;

  return [querySQL, []];
}

export async function fetchCommunitiesTotalCount(): Promise<number> {
  const params = createSQLQueryParams();

  const result = (await getQueryFromPool(...params)) as { count: number }[];

  return result[0].count;
}
