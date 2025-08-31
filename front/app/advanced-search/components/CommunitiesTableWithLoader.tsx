'use client';

import { useAdvancedSearch } from '#utils/hooks/useAdvancedSearch';
import { getSortingStateParser } from '#utils/parsers';
import type { AdvancedSearchCommunity } from '@/app/models/community';
import { parseAsInteger, useQueryState } from 'nuqs';

import { useFiltersParams } from '../hooks/useFiltersParams';
import { AdvancedSearchDataTable } from './AdvancedSearchDataTable';

export default function CommunitiesTableWithLoader() {
  const { filters } = useFiltersParams();

  // Get pagination from DataTable URL params
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pagination = {
    page,
    limit: perPage,
  };

  // Get sorting from DataTable URL params
  const columnIds = new Set([
    'nom',
    'type',
    'population',
    'subventions_budget',
    'mp_score',
    'subventions_score',
  ]);
  const [sorting] = useQueryState(
    'sort',
    getSortingStateParser<AdvancedSearchCommunity>(columnIds).withDefault([
      { id: 'nom', desc: false },
    ]),
  );

  // Convert to API format
  const order = {
    by: (sorting[0]?.id || 'nom') as
      | 'nom'
      | 'type'
      | 'population'
      | 'subventions_budget'
      | 'mp_score'
      | 'subventions_score',
    direction: (sorting[0]?.desc ? 'DESC' : 'ASC') as 'ASC' | 'DESC',
  };

  const { data, isLoading } = useAdvancedSearch(filters, pagination, order);

  // Pendant le chargement, afficher le tableau avec skeletons
  if (isLoading || !data) {
    const pageCount = 0;
    return <AdvancedSearchDataTable communities={[]} pageCount={pageCount} isLoading={true} />;
  }

  // Afficher les données réelles
  const pageCount = data.length > 0 ? Math.ceil(data[0].total_row_count / pagination.limit) : 0;
  return <AdvancedSearchDataTable communities={data} pageCount={pageCount} isLoading={false} />;
}
