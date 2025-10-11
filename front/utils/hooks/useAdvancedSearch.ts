import { AdvancedSearchOrder } from '#app/api/advanced_search/advancedSearchUtils';
import { useQuery } from '@tanstack/react-query';

import { fetchCommunitiesAdvancedSearch } from '../fetchers/advanced-search/fetchCommunitiesAdvancedSearch-client';
import { CommunitiesAdvancedSearchFilters } from '../fetchers/advanced-search/fetchCommunitiesAdvancedSearch-server';
import { Pagination } from '../fetchers/types';

export function useAdvancedSearch(
  filters: CommunitiesAdvancedSearchFilters,
  pagination: Pagination,
  order: AdvancedSearchOrder,
) {
  const queryKey = ['communities', filters, pagination, order];

  const queryResult = useQuery({
    queryKey,
    queryFn: () => fetchCommunitiesAdvancedSearch(filters, pagination, order),
  });

  return queryResult;
}
