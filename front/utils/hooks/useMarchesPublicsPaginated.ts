import { MarchePublic } from '#app/models/marchePublic';
import { useQuery } from '@tanstack/react-query';

import { fetchMarchesPublicsPaginated } from '../fetchers/marches-publics/fetchMarchesPublicsPaginated-client';
import { Pagination } from '../fetchers/types';

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
};

const DEFAULT_BY: keyof MarchePublic = 'montant';

export function useMarchesPublicsPaginated(
  siren: string,
  year: number | null,
  pagination = DEFAULT_PAGINATION,
  by = DEFAULT_BY,
) {
  const queryKey = ['communities', siren, 'marches-publics', year, pagination, by];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMarchesPublicsPaginated(siren, year, pagination, by),
  });

  return query;
}
