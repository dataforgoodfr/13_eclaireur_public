import { Community } from '@/app/models/community';

import { CommunityType } from '../../types';

export type CommunityParams = Partial<Pick<Community, 'siren' | 'type'>> & {
  limit?: number;
};

const TABLE_NAME = 'staging_marches_public';

/**
 * Create the sql query for the marches publics
 * @param options
 * @returns
 */
export function createSQLQueryParams(options?: CommunityParams) {
  let query = `SELECT * FROM ${TABLE_NAME}`;
  let values: (CommunityType | number | string)[] = [];

  if (options === undefined) {
    return [query, values] as const;
  }

  const { limit, ...restOptions } = options;

  const whereConditions: string[] = [];

  const keys = Object.keys(restOptions) as unknown as (keyof typeof options)[];

  keys.forEach((key) => {
    const option = options[key];
    if (option == null) {
      throw new Error(
        `${key} with value ${option} is null or undefined and blocks the query ${query}`,
      );
    }

    whereConditions.push(`${key} = $${values.length + 1}`);
    values.push(option);
  });

  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }

  if (limit) {
    query += ` LIMIT ${values.length + 1}`;
    values.push(limit);
  }

  return [query, values] as const;
}
