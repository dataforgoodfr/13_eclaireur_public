import { CommunitiesParamsOptions } from '@/app/api/selected_communities/types';

import { CommunityType } from '../../types';

/**
 * Create the sql query for the communities
 * @param options
 * @returns
 */
export function createSQLQueryParams(options?: CommunitiesParamsOptions) {
  let query = 'SELECT * FROM selected_communities';
  let values: (CommunityType | number | string | undefined)[] = [];

  if (options === undefined) {
    return [query, values] as const;
  }

  const { type, siren, limit } = options;

  const whereConditions: string[] = [];

  if (type) {
    whereConditions.push(`type = $${values.length + 1}`);
    values.push(type);
  }

  if (siren) {
    whereConditions.push(`siren = $${values.length + 1}`);
    values.push(siren);
  }

  if (whereConditions.length > 0) {
    query += ' WHERE ' + whereConditions.join(' AND ');
  }

  query += ' LIMIT $' + (values.length + 1);
  values.push(limit);

  return [query, values] as const;
}
