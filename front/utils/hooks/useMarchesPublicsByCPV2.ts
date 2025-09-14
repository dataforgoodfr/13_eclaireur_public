import { useQuery } from '@tanstack/react-query';

import { fetchMarchesPublicsByCPV2 } from '../fetchers/marches-publics/fetchMarchesPublicsByCPV2-client';
import type { Pagination } from '../fetchers/types';

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
};

export function useMarchesPublicsByCPV2(
  siren: string,
  year: number | null,
  pagination = DEFAULT_PAGINATION,
  maxAmount?: number | null,
) {
  // Use the entire pagination object in queryKey to ensure proper reactivity
  const queryKey = [
    'communities',
    siren,
    'marches-publics',
    'cpv_2',
    year,
    pagination,
    maxAmount ?? null,
  ];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMarchesPublicsByCPV2(siren, year, pagination, maxAmount ?? null),
  });

  return query;
}
