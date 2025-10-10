import { useQuery } from '@tanstack/react-query';

import { fetchCommunesByCode } from '../../fetchers/map/map-fetchers';

export function useCommunes(communeCodes: string[], year: number) {
  return useQuery({
    queryKey: ['communes', communeCodes.sort().join(','), year],
    queryFn: () => fetchCommunesByCode(communeCodes, year),
    enabled: communeCodes.length > 0,
    staleTime: 1000 * 60 * 10,
    placeholderData: (previousData) => previousData,
  });
}
