import { useQuery } from '@tanstack/react-query';
import { Options, fetchCommunities } from 'utils/fetchers/fetchCommunities';

export function useCommunities(options?: Options) {
  const queryKey = ['communities', options];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchCommunities(options),
  });

  return query;
}
