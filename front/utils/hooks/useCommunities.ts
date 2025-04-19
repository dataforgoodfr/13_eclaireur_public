import { useQuery } from '@tanstack/react-query';

import { CommunitiesOptions } from '../fetchers/communities/createSQLQueryParams';
import { fetchCommunities } from '../fetchers/communities/fetchCommunities-client';
import { Pagination } from '../fetchers/types';

export function useCommunities(options?: CommunitiesOptions, pagination?: Pagination) {
  const queryKey = ['communities', options];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchCommunities(options, pagination),
  });

  return query;
}
