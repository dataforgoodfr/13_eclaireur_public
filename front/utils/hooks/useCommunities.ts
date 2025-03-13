import { useQuery } from '@tanstack/react-query';

import { CommunitiesOptions } from '../fetchers/communities/createSQLQueryParams';
import { fetchCommunities } from '../fetchers/communities/fetchCommunities-client';

export function useCommunities(options?: CommunitiesOptions) {
  const queryKey = ['communities', options];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchCommunities(options),
  });

  return query;
}
