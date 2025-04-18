import { useQuery } from '@tanstack/react-query';

import { fetchCommunitiesAdvancedSearch } from '../fetchers/advanced-search/fetchCommunitiesAdvancedSearch-client';
import { CommunitiesAdvancedSearchFilters } from '../fetchers/advanced-search/fetchCommunitiesAdvancedSearch-server';
import { Pagination } from '../fetchers/types';

export function useAdvancedSearch(
  filters: CommunitiesAdvancedSearchFilters,
  pagination: Pagination,
) {
  const queryKey = ['communities', filters, pagination];

  const queryResult = useQuery({
    queryKey,
    queryFn: () => fetchCommunitiesAdvancedSearch(filters, pagination),
  });

  console.log(queryResult.data);

  return queryResult;
}
