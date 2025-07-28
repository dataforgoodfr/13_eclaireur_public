import { AdvancedSearchOrder } from '#app/advanced-search/hooks/useOrderParams';
import { AdvancedSearchCommunity } from '#app/models/community';

import { Pagination } from '../types';
import { CommunitiesAdvancedSearchFilters } from './fetchCommunitiesAdvancedSearch-server';

const API_ROUTE = '/api/advanced_search';
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Fetch communities using API routes
 * @param filters
 * @returns
 */
export async function fetchCommunitiesAdvancedSearch(
  filters: CommunitiesAdvancedSearchFilters,
  pagination: Pagination,
  order: AdvancedSearchOrder,
): Promise<AdvancedSearchCommunity[]> {
  const { type, population, mp_score, subventions_score } = filters;

  const url = new URL(API_ROUTE, baseURL);

  if (type) url.searchParams.append('type', type);
  if (population) url.searchParams.append('population', population.toString());
  if (mp_score) url.searchParams.append('mp_score', mp_score);
  if (subventions_score) url.searchParams.append('subventions_score', subventions_score);

  url.searchParams.append('page', pagination.page.toString());
  url.searchParams.append('limit', pagination.limit.toString());

  url.searchParams.append('by', order.by);
  url.searchParams.append('direction', order.direction);

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch communities');
  }

  return (await res.json()) as Promise<AdvancedSearchCommunity[]>;
}
