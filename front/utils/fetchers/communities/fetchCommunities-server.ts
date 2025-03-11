import { Community } from '@/app/models/community';
import { getQueryFromPool } from '@/utils/db';

import { CommunitiesOptions, createSQLQueryParams } from './createSQLQueryParams';

/**
 * Fetch the communities (SSR) with options/filters
 * @param filters
 * @returns
 */
export async function fetchCommunities(options?: CommunitiesOptions): Promise<Community[]> {
  const params = createSQLQueryParams(options);

  return getQueryFromPool(...params) as Promise<Community[]>;
}
