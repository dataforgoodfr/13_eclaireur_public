'use client'

import { useAdvancedSearch } from '@/utils/hooks/useAdvancedSearch';

import { AdvancedSearchTable } from './AdvanceSearchTable';
import { NoResults } from './NoResults';
import { useFiltersParams } from '../hooks/useFiltersParams';
import { useOrderParams } from '../hooks/useOrderParams';
import { usePaginationParams } from '../hooks/usePaginationParams';
import Loading from '@/components/ui/Loading';


export default function CommunitiesTableWithLoader() {
  const { filters } = useFiltersParams();
  const { pagination } = usePaginationParams();
  const { order } = useOrderParams();

  const { data } = useAdvancedSearch(filters, pagination, order);

  if (!data) return <Loading />;

  if (data && data.length > 0) {
    return <AdvancedSearchTable communities={data} />;
  }

  return <NoResults />;
}