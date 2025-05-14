import { Contact } from '@/app/models/contact';
import { getQueryFromPool } from '@/utils/db';

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
): Promise<Contact[]> {
  const params = createSQLQueryParams(options, pagination);

  return getQueryFromPool(...params) as Promise<Contact[]>;
}
