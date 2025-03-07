import { CommunitiesParamsOptions } from 'app/api/selected_communities/types';

import { getQueryFromPool } from '../../db';
import { Community } from '../../types';
import { createSQLQueryParams } from './createSQLQueryParams';

export type Options = Omit<CommunitiesParamsOptions, 'limit'> & {
  limit?: number;
};

export async function getCommunities(options?: CommunitiesParamsOptions): Promise<Community[]> {
  const params = createSQLQueryParams(options);

  return getQueryFromPool(...params) as Promise<Community[]>;
}
