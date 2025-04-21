'use client';

import { Suspense } from 'react';

import { Metadata } from 'next';

import Loading from '@/components/ui/Loading';
import { useAdvancedSearch } from '@/utils/hooks/useAdvancedSearch';

import { CommunitiesTable } from './components/CommunitiesTable';
import DownloadingButton from './components/DownloadingButton';
import { Filters } from './components/Filters/Filters';
import GoBackHome from './components/GoBackHome';
import { NoResults } from './components/NoResults';
import { useFiltersParams } from './hooks/useFiltersParams';
import { useOrderParams } from './hooks/useOrderParams';
import { usePaginationParams } from './hooks/usePaginationParams';

export const metadata: Metadata = {
  title: 'Télécharger',
  description: "Éclaireur Public met à disposition l'ensemble des données utilisées sur le site",
};

export default function Page() {
  const { filters } = useFiltersParams();
  const { pagination } = usePaginationParams();
  const { order } = useOrderParams();

  const { data } = useAdvancedSearch(filters, pagination, order);

  return (
    <Suspense>
      <div className='global-margin my-20 flex flex-col gap-x-10 gap-y-5'>
        <GoBackHome />
        <h1 className='text-2xl font-bold'>Recherche Avancée</h1>
        <div className='flex items-end justify-between'>
          <Filters />
          <DownloadingButton />
        </div>
        {!data && <Loading />}
        {data && data.length > 0 && <CommunitiesTable communities={data.filter((d) => d.siren)} />}
        {data && data.length === 0 && <NoResults />}
      </div>
    </Suspense>
  );
}
