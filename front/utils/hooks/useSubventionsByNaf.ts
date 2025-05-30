import { useQuery } from '@tanstack/react-query';

import { fetchSubventionsByNaf } from '../fetchers/subventions/fetchSubventionsByNaf-client';
import { Pagination } from '../fetchers/types';

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
};

export function useSubventionsByNaf(
  siren: string,
  year: number | null,
  pagination = DEFAULT_PAGINATION,
  maxAmount: number | null,
) {
  const queryKey = ['communities', siren, 'subventions', 'naf2', year, pagination, maxAmount];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchSubventionsByNaf(siren, year, pagination, maxAmount),
  });

  return query;
}
