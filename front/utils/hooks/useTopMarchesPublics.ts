import { useQuery } from '@tanstack/react-query';

import { fetchTopMarchesPublicsBySector } from '../fetchers/marches-publics/fetchTopMarchesPublicsBySector-client';

export function useTopMarchesPublicsBySector(siren: string, year: number | null, limit?: number) {
  const queryKey = ['marches-publics', 'top', 'sector', siren, year, limit];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTopMarchesPublicsBySector(siren, year, limit),
  });

  return query;
}
