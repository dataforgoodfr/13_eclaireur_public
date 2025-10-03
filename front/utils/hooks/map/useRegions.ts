import { useQuery } from '@tanstack/react-query';

import { fetchRegionsByCode } from '../../fetchers/map/map-fetchers';

export function useRegions(regionCodes: string[], year: number) {
  return useQuery({
    queryKey: ['regions', regionCodes.sort().join(','), year],
    queryFn: () => fetchRegionsByCode(regionCodes, year),
    enabled: regionCodes.length > 0,
    staleTime: 1000 * 60 * 10,
  });
}
