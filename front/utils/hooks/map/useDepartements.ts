import { useQuery } from '@tanstack/react-query';

import { fetchDepartementsByCode } from '../../fetchers/map/map-fetchers';

export function useDepartements(departementCodes: string[], year: number) {
  return useQuery({
    queryKey: ['departements', departementCodes.sort().join(','), year],
    queryFn: () => fetchDepartementsByCode(departementCodes, year),
    enabled: departementCodes.length > 0,
    staleTime: 1000 * 60 * 10,
  });
}
