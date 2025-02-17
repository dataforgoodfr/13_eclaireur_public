import { useQuery } from '@tanstack/react-query';
import { CommunitiesParamsOptions, fetchCommunities } from 'utils/fetchers/fetchCommunities';

export function useCommunities(options?: CommunitiesParamsOptions) {
  const queryKey = ['communities', options];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchCommunities(options),
  });

  return query;
}
