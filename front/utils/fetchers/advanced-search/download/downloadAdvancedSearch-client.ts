import { AdvancedSearchOrder } from '#app/api/advanced_search/advancedSearchUtils';
import { downloadURL } from '#utils/downloader/downloadURL';

import { CommunitiesAdvancedSearchFilters } from '../fetchCommunitiesAdvancedSearch-server';

const API_ROUTE = '/api/advanced_search/download';

/**
 * Create downloading URL to download advanced all search results
 * @param filters
 * @param order
 * @returns
 */
export function createAdvancedSearchDownloadingURL(
  filters: CommunitiesAdvancedSearchFilters,
  order: AdvancedSearchOrder,
): URL {
  const { type, population, mp_score, subventions_score } = filters;

  const url = new URL(API_ROUTE, window.location.origin);

  if (type) url.searchParams.append('type', type);
  if (population) url.searchParams.append('population', population.toString());
  if (mp_score) url.searchParams.append('mp_score', mp_score);
  if (subventions_score) url.searchParams.append('subventions_score', subventions_score);

  url.searchParams.append('by', order.by);
  url.searchParams.append('direction', order.direction);
  return url;
}

export function downloadAdvancedSearchCSV(
  filters: CommunitiesAdvancedSearchFilters,
  order: AdvancedSearchOrder,
) {
  const url = createAdvancedSearchDownloadingURL(filters, order);

  downloadURL(url);
}
