import { useQuery } from '@tanstack/react-query';

import { fetchRegionsByCode } from '../../fetchers/map/map-fetchers';

export function useRegions(regionCodes: string[]) {
  return useQuery({
    queryKey: ['regions', regionCodes.sort().join(',')],
    queryFn: () => fetchRegionsByCode(regionCodes),
    enabled: regionCodes.length > 0,
    staleTime: 1000 * 60 * 10,
  });
}
