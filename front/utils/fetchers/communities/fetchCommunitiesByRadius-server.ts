import { Community } from '#app/models/community';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE = DataTable.Communities;

/**
 *
 * @param latitude latitude of the center of search
 * @param longitude longitude of the center of search
 * @param radius Search radius in km
 * @returns
 */
export function createSQLQueryParams(
  latitude: number,
  longitude: number,
  radius: number,
): [string, (string | number)[]] {
  const values = [latitude, longitude, radius * 1000];

  const querySQL = `
  with temp as (select latitude, longitude, nom
FROM ${TABLE}
)
select latitude, longitude, nom, earth_distance(
        ll_to_earth(latitude, longitude),
        ll_to_earth($1, $2)
    ) as dist
from temp
where earth_distance(
        ll_to_earth(latitude, longitude),
        ll_to_earth($1, $2)
    ) between 1 and $3;`;

  return [querySQL, values];
}

/**
 * Fetch the communities (SSR) by radius search
 * @param latitude latitude of the center of search
 * @param longitude longitude of the center of search
 * @param radius Search radius in KM
 * @returns
 */
export async function fetchCommunitiesByRadius(
  latitude: number,
  longitude: number,
  radius: number,
): Promise<Pick<Community, 'nom' | 'latitude' | 'longitude'>[]> {
  const params = createSQLQueryParams(latitude, longitude, radius);

  return getQueryFromPool(...params) as Promise<
    Pick<Community, 'nom' | 'latitude' | 'longitude'>[]
  >;
}
