import { downloadURL } from '@/utils/downloader/downloadURL';

import { Pagination } from '../../types';
import { CommunitiesAdvancedSearchFilters } from '../fetchCommunitiesAdvancedSearch-server';

const API_ROUTE = '/api/advanced_search/download';
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export function createAdvancedSearchDownloadingLink(
  filters: CommunitiesAdvancedSearchFilters,
  pagination: Pagination,
): URL {
  const { type, population, mp_score, subventions_score } = filters;

  const url = new URL(API_ROUTE, baseURL);

  if (type) url.searchParams.append('type', type);
  if (population) url.searchParams.append('population', population.toString());
  if (mp_score) url.searchParams.append('mp_score', mp_score);
  if (subventions_score) url.searchParams.append('subventions_score', subventions_score);

  url.searchParams.append('page', pagination.page.toString());
  url.searchParams.append('limit', pagination.limit.toString());

  return url;
}

export function downloadAdvancedSearchCSV(
  filters: CommunitiesAdvancedSearchFilters,
  pagination: Pagination,
) {
  const url = createAdvancedSearchDownloadingLink(filters, pagination);

  downloadURL(url);
}
