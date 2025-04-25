import { useQuery } from '@tanstack/react-query';

import { fetchTopSubventionsByNaf } from '../fetchers/subventions/fetchTopSubventionsByNaf-client';
import { Pagination } from '../fetchers/types';

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
};

export function useTopSubventionsByNaf(
  siren: string,
  year: number | null,
  pagination = DEFAULT_PAGINATION,
) {
  const queryKey = ['subventions', 'top', 'sector', siren, year, pagination];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTopSubventionsByNaf(siren, year, pagination),
  });

  return query;
}
