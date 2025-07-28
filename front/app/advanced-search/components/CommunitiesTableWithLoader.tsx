'use client';

import { parseAsInteger, useQueryState } from 'nuqs';
import { getSortingStateParser } from '#lib/parsers';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { useAdvancedSearch } from '#utils/hooks/useAdvancedSearch';

import { useFiltersParams } from '../hooks/useFiltersParams';
import { AdvancedSearchDataTable } from './AdvancedSearchDataTable';
import { NoResults } from './NoResults';

export default function CommunitiesTableWithLoader() {
  const { filters } = useFiltersParams();
  
  // Get pagination from DataTable URL params
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  
  const pagination = {
    page,
    limit: perPage
  };
  
  // Get sorting from DataTable URL params
  const columnIds = new Set(['nom', 'type', 'population', 'subventions_budget', 'mp_score', 'subventions_score']);
  const [sorting] = useQueryState(
    'sort',
    getSortingStateParser(columnIds).withDefault([{ id: 'nom', desc: false }])
  );
  
  // Convert to API format
  const order = {
    by: (sorting[0]?.id || 'nom') as 'nom' | 'type' | 'population' | 'subventions_budget' | 'mp_score' | 'subventions_score',
    direction: (sorting[0]?.desc ? 'DESC' : 'ASC') as 'ASC' | 'DESC'
  };

  const { data } = useAdvancedSearch(filters, pagination, order);

  if (!data) {
    return (
      <div className="w-full space-y-2.5">
        <DataTableSkeleton 
          columnCount={6}
          rowCount={perPage}
          filterCount={0}
          withViewOptions={true}
          withPagination={true}
        />
      </div>
    );
  }

  if (data) {
    const pageCount = data.length > 0 ? Math.ceil(data[0].total_row_count / pagination.limit) : 0;
    return <AdvancedSearchDataTable communities={data} pageCount={pageCount} />;
  }

  // Fallback - should not happen with skeleton loading above
  return <NoResults />;
}
