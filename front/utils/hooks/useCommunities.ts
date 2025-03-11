import { useQuery } from '@tanstack/react-query';

import { CommunitiesParams } from '../fetchers/communities/createSQLQueryParams';
import { fetchCommunities } from '../fetchers/communities/fetchCommunities-client';

export function useCommunities(options?: CommunitiesParams) {
  const queryKey = ['communities', options?.type];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchCommunities(options),
  });

  return query;
}
