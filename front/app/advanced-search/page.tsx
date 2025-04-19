'use client';

import Loading from '@/components/ui/Loading';
import { useAdvancedSearch } from '@/utils/hooks/useAdvancedSearch';

import { CommunitiesTable } from './components/CommunitiesTable';
import { Filters } from './components/Filters/Filters';
import GoBackHome from './components/GoBackHome';
import { NoResults } from './components/NoResults';
import { useFiltersParams } from './hooks/useFiltersFromSearchParams';
import { usePaginationFromSearchParams } from './hooks/usePaginationFromSearchParams';

export default function Page() {
  const { filters } = useFiltersParams();
  const { pagination } = usePaginationFromSearchParams();

  const { data } = useAdvancedSearch(filters, pagination);

  return (
    <div className='global-margin my-20 flex flex-col gap-x-10 gap-y-5'>
      <GoBackHome />
      <h1 className='text-2xl font-bold'>Recherche Avancée</h1>
      <Filters />
      {!data && <Loading />}
      {data && data.length > 0 && <CommunitiesTable communities={data.filter((d) => d.siren)} />}
      {data && data.length === 0 && <NoResults />}
    </div>
  );
}
