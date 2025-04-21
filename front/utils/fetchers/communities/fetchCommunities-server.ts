import { Community } from '@/app/models/community';
import { getQueryFromPool } from '@/utils/db';

import { Pagination } from '../types';
import { CommunitiesOptions, createSQLQueryParams } from './createSQLQueryParams';

/**
 * Fetch the communities (SSR) with options/filters
 * @param filters
 * @returns
 */
export async function fetchCommunities(
  options?: CommunitiesOptions,
  pagination?: Pagination,
): Promise<Community[]> {
  const params = createSQLQueryParams(options, pagination);

  return getQueryFromPool(...params) as Promise<Community[]>;
}
