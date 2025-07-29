import { Suspense } from 'react';

import type { Metadata } from 'next';

import Loading from '#components/ui/Loading';

import AdvancedSearchPageContent from './components/AdvancedSearchPageContent';
import GoBackHome from './components/GoBackHome';

export const metadata: Metadata = {
  title: 'Recherche avancée',
  description:
    'Télécharger les données des collectivités sélectionnées par les filtres de recherche.',
};

export default function Page() {
  return (
    <div className='container mx-auto max-w-[1200px] my-20 flex flex-col gap-x-10 gap-y-5 px-4 md:px-6'>
      <GoBackHome />
      <h1 className='text-2xl font-bold'>Recherche Avancée</h1>
      <Suspense fallback={<Loading />}>
        <AdvancedSearchPageContent />
      </Suspense>
    </div>
  );
}
