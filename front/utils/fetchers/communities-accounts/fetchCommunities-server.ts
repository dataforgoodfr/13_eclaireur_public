import { CommunityAccount } from '@/app/models/communityAccount';
import { getQueryFromPool } from '@/utils/db';

import { Pagination } from '../types';
import { CommunitiesAccountsOptions, createSQLQueryParams } from './createSQLQueryParams';

/**
 * Fetch the communities (SSR) with options/filters
 * @param filters
 * @returns
 */
export async function fetchCommunityAccounts(
  options?: CommunitiesAccountsOptions,
  pagination?: Pagination,
): Promise<CommunityAccount[]> {
  const params = createSQLQueryParams(options, pagination);

  return getQueryFromPool(...params) as Promise<CommunityAccount[]>;
}
