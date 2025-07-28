import { Suspense } from 'react';

import type { Metadata } from 'next';

import Loading from '#components/ui/Loading';

import CommunitiesTableWithLoader from './components/CommunitiesTableWithLoader';
import DownloadingButton from './components/DownloadingButton';
import { Filters } from './components/Filters/Filters';
import GoBackHome from './components/GoBackHome';

export const metadata: Metadata = {
  title: 'Recherche avancée',
  description:
    'Télécharger les données des collectivités sélectionnées par les filtres de recherche.',
};

export default function Page() {
  return (
    <div className='global-margin my-20 flex flex-col gap-x-10 gap-y-5'>
      <GoBackHome />
      <h1 className='text-2xl font-bold'>Recherche Avancée</h1>
      <Suspense fallback={<Loading />}>
        <div className='flex items-end justify-between'>
          <Filters />
          <DownloadingButton />
        </div>
      </Suspense>
      <Suspense fallback={<Loading />}>
        <CommunitiesTableWithLoader />
      </Suspense>
    </div>
  );
}
