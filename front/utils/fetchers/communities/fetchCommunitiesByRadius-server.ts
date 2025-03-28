import { Community } from '@/app/models/community';
import { getQueryFromPool } from '@/utils/db';

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
  with temp_test as (select cast(REPLACE(latitude, ',', '.') as numeric(10,6))::float as latitude, cast(REPLACE(longitude, ',', '.') as numeric(10,6))::float as longitude, nom
FROM public.selected_communitiestest_indices
where not siren = 248500415 and not siren = 0)
select latitude, longitude, nom, earth_distance(
        ll_to_earth(latitude, longitude),
        ll_to_earth($1, $2)
    ) as dist
from temp_test
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
): Promise<Community[]> {
  const params = createSQLQueryParams(latitude, longitude, radius);

  return getQueryFromPool(...params) as Promise<Community[]>;
}
