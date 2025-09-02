import { SimilarCommunity } from '#app/models/comparison';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE = DataTable.Communities;

const SIMILAR_COMMUNITY_NUMBER = 4;

/**
 *
 * @param siren siren de la collectivité comparée
 * @returns
 */
function createSQLQueryParams(siren: string): [string, (string | number)[]] {
  const values = [siren];

  const querySQL = `
  select 
    c.siren,
    c.nom
  from ${TABLE} c 
  join ${TABLE} c_target on c_target.siren = $1
  where c.siren != $1 and c.categorie = c_target.categorie
  order by abs(c.population - c_target.population) asc
  limit ${SIMILAR_COMMUNITY_NUMBER}`;

  return [querySQL, values];
}

/**
 * Fetch the communities (SSR) by radius search
 * @param siren siren de la collectivité comparée
 * @returns
 */
export async function fetchSimilarCommunityList(siren: string): Promise<SimilarCommunity[]> {
  const params = createSQLQueryParams(siren);
  return getQueryFromPool(...params) as Promise<SimilarCommunity[]>;
}
