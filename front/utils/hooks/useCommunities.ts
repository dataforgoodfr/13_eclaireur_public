import { Options } from '@/utils/fetchers/communities/communities-server';
import { useQuery } from '@tanstack/react-query';

import { fetchCommunities } from '../fetchers/communities/communities-client';

export function useCommunities(options?: Options) {
  const queryKey = ['communities', options?.type];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchCommunities(options),
  });

  return query;
}
