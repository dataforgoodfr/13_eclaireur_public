import { useQuery } from '@tanstack/react-query';

import { fetchMarchesPublicsByCPV2 } from '../fetchers/marches-publics/fetchMarchesPublicsByCPV2-client';
import { Pagination } from '../fetchers/types';

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
};

export function useMarchesPublicsByCPV2(
  siren: string,
  year: number | null,
  pagination = DEFAULT_PAGINATION,
) {
  const queryKey = ['marches-publics', 'top', 'sector', siren, year, pagination];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMarchesPublicsByCPV2(siren, year, pagination),
  });

  return query;
}
