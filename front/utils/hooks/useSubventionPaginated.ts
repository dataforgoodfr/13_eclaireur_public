import { Subvention } from '#app/models/subvention';
import { useQuery } from '@tanstack/react-query';

import { fetchSubventionPaginated } from '../fetchers/subventions/fetchSubventionPaginated-client';
import { Pagination } from '../fetchers/types';

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
};

const DEFAULT_BY: keyof Subvention = 'montant';

export function useMarchesPublicsPaginated(
  siren: string,
  year: number | null,
  pagination = DEFAULT_PAGINATION,
  by = DEFAULT_BY,
) {
  const queryKey = ['communities', siren, 'subvention', year, pagination, by];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchSubventionPaginated(siren, year, pagination, by),
  });

  return query;
}
