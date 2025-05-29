import { useQuery } from '@tanstack/react-query';

import { fetchDepartementsByCode } from '../../fetchers/map/map-fetchers';

export function useDepartements(departementCodes: string[]) {
  return useQuery({
    queryKey: ['departements', departementCodes.sort().join(',')],
    queryFn: () => fetchDepartementsByCode(departementCodes),
    enabled: departementCodes.length > 0,
    staleTime: 1000 * 60 * 10,
  });
}
