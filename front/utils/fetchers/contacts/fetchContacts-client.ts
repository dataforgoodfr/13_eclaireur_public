import { CommunityContact } from '#app/models/communityContact';

import { Pagination } from '../types';
import { ContactsOptions } from './createSQLQueryParams';

const API_ROUTE = '/api/selected_communities';

/**
 * Fetch elus using API routes
 * @param options
 * @returns
 */
export async function fetchContacts(
  options?: ContactsOptions,
  pagination?: Pagination,
): Promise<CommunityContact[]> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const limit = options?.limit;
  const siren = options?.filters?.siren;
  const type = options?.filters?.type;

  const url = new URL(API_ROUTE, baseURL);

  if (siren) url.searchParams.append('siren', siren);
  if (!pagination && limit) url.searchParams.append('limit', limit.toString());
  if (pagination) {
    url.searchParams.append('page', pagination.page.toString());
    url.searchParams.append('limit', pagination.limit.toString());
  }

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch communities');
  }

  return (await res.json()) as Promise<CommunityContact[]>;
}
