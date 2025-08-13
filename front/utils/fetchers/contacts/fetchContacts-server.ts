import { CommunityContact } from '#app/models/communityContact';
import { getQueryFromPool } from '#utils/db';

import { Pagination } from '../types';
import { ContactsOptions, createSQLQueryParams } from './createSQLQueryParams';

/**
 * Fetch the contacts (SSR) with options/filters
 * @param filters
 * @returns
 */
export async function fetchContacts(
  options?: ContactsOptions,
  pagination?: Pagination,
): Promise<CommunityContact[]> {
  const params = createSQLQueryParams(options, pagination);

  return getQueryFromPool(...params) as Promise<CommunityContact[]>;
}
