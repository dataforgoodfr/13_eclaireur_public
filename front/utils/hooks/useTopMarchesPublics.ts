import { useQuery } from '@tanstack/react-query';

import { fetchTopMarchesPublicsBySector } from '../fetchers/marches-publics/fetchTopMarchesPublicsBySector-client';

export function useTopMarchesPublicsBySector(siren: string, limit?: number) {
  const queryKey = ['marches-publics', 'top', 'sector', siren, limit];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTopMarchesPublicsBySector(siren, limit),
  });

  return query;
}
