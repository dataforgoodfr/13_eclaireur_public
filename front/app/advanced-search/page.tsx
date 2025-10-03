import { Suspense } from 'react';

import type { Metadata } from 'next';

import { SectionHeader } from '#app/components/SectionHeader';
import Loading from '#components/ui/Loading';

import AdvancedSearchPageContent from './components/AdvancedSearchPageContent';

const title = 'Recherche Avancée';
const description =
  'Recherchez les dernières données de dépenses publiques de votre collectivité locale.';

export const metadata: Metadata = {
  title: title,
  description: description,
};

export default function Page() {
  return (
    <main>
      <SectionHeader sectionTitle={title} sectionSubTitle={description} displayGoBack={true} />
      <div className='global-margin my-3 flex flex-col gap-x-10 gap-y-5 lg:my-20'>
        <Suspense fallback={<Loading />}>
          <AdvancedSearchPageContent />
        </Suspense>
      </div>
    </main>
  );
}
