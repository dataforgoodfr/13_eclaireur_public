import { useQuery } from '@tanstack/react-query';

import { fetchTopMarchesPublicsBySector } from '../fetchers/marches-publics/fetchTopMarchesPublicsBySector-client';
import { Pagination } from '../fetchers/types';

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
};

export function useTopMarchesPublicsBySector(
  siren: string,
  year: number | null,
  pagination = DEFAULT_PAGINATION,
) {
  const queryKey = ['marches-publics', 'top', 'sector', siren, year, pagination];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTopMarchesPublicsBySector(siren, year, pagination),
  });

  return query;
}
