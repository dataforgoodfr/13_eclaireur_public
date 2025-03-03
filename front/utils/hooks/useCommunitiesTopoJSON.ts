import { useQuery } from '@tanstack/react-query';

import { fetchGeoCommunities } from '../fetchers/fetchGeoCommunities-client';

export function useCommunitiesTopoJSON() {
  const queryKey = ['communitiesTopoJSON'];

  const query = useQuery({
    queryKey,
    queryFn: fetchGeoCommunities,
  });

  return query;
}
