import { useQuery } from '@tanstack/react-query';

import { fetchCommunesByCode } from '../../fetchers/map/map-fetchers';

export function useCommunes(communeCodes: string[]) {
  return useQuery({
    queryKey: ['communes', communeCodes.sort().join(',')],
    queryFn: () => fetchCommunesByCode(communeCodes),
    enabled: communeCodes.length > 0,
    staleTime: 1000 * 60 * 10,
  });
}
