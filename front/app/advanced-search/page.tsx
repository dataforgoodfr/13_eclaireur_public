'use client';

import { useAdvancedSearch } from '@/utils/hooks/useAdvancedSearch';

import FicheGoBack from '../community/[siren]/components/FicheHeader/FicheGoBack';
import { CommunitiesTable } from './components/CommunitiesTable';
import { Filters } from './components/Filters/Filters';
import { useFiltersParams } from './hooks/useFiltersFromSearchParams';
import { usePaginationFromSearchParams } from './hooks/usePaginationFromSearchParams';

export default function Page() {
  const { filters } = useFiltersParams();
  const { pagination } = usePaginationFromSearchParams();

  const { data } = useAdvancedSearch(filters, pagination);

  return (
    <>
      <FicheGoBack />
      <div className='global-margin my-20 flex flex-col gap-x-10 gap-y-5'>
        <Filters />
        {data && data.length > 0 && <CommunitiesTable communities={data.filter((d) => d.siren)} />}
      </div>
    </>
  );
}
