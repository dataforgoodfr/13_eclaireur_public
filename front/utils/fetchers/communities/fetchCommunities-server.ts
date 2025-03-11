import { Community } from '@/app/models/community';
import { getQueryFromPool } from '@/utils/db';

import { CommunitiesParams, createSQLQueryParams } from './createSQLQueryParams';

/**
 * Fetch the communities (SSR) with options/filters
 * @param options
 * @returns
 */
export async function fetchCommunities(options?: CommunitiesParams): Promise<Community[]> {
  const params = createSQLQueryParams(options);

  return getQueryFromPool(...params) as Promise<Community[]>;
}
