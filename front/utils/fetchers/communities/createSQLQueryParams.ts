import { CommunitiesParamsOptions } from '@/app/api/selected_communities/types';

import { CommunityType } from '../../types';

/**
 * Create the sql query for the communities
 * @param options
 * @returns
 */
export function createSQLQueryParams(options?: CommunitiesParamsOptions) {
  let query = 'SELECT * FROM selected_communities';
  let values: (CommunityType | number | undefined)[] = [];

  if (options === undefined) {
    return [query, values] as const;
  }

  const { type, limit } = options;

  if (type !== undefined && limit !== undefined) {
    query += ' WHERE type = $1 LIMIT $2';
    values = [type, limit];
  }

  if (type !== undefined && limit === undefined) {
    query += ' WHERE type = $1';
    values = [type];
  }

  if (type === undefined && limit !== undefined) {
    query += ' LIMIT $1';
    values = [limit];
  }

  return [query, values] as const;
}
