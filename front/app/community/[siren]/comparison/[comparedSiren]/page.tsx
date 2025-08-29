import { Suspense } from 'react';

import type { Metadata } from 'next';

import { fetchCommunities } from '#utils/fetchers/communities/fetchCommunities-server';

import { ComparisonType } from './components/ComparisonType';
import { HeaderComparison } from './components/HeaderComparison';
import { MPSubvComparison } from './components/MPSubvComparison';
import { TransparencyComparison } from './components/TransparencyComparison';
import { ComparisonHeader } from './components/shared/ComparisonHeader';
import { ComparisonModificationCard } from './components/shared/ComparisonModificationCard';
import { DataTableSkeleton } from './components/skeletons/DataTableSkeleton';
import { TransparencySkeleton } from './components/skeletons/TransparencySkeleton';

// Activer Partial Prerendering pour Next.js 15
export const experimental_ppr = true;

type PageProps = { params: Promise<{ siren: string; comparedSiren: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siren = (await params).siren;
  const siren2 = (await params).comparedSiren;
  const community = await getCommunity(siren);
  const community2 = await getCommunity(siren2);

  return {
    title: 'Comparaison de collectivités',
    description: `Comparer les dernières données de dépenses publiques de ${community.nom} avec ${community2.nom} `,
  };
}

async function getCommunity(siren: string) {
  const communitiesResults = await fetchCommunities({ filters: { siren } });

  if (communitiesResults.length === 0) {
    throw new Error(`Community doesnt exist with siren ${siren}`);
  }

  return communitiesResults[0];
}

export default async function Page({ params }: PageProps) {
  const siren = (await params).siren;
  const siren2 = (await params).comparedSiren;

  // Parallel data fetching pour optimiser les performances
  const [community1, community2] = await Promise.all([getCommunity(siren), getCommunity(siren2)]);

  return (
    <>
      <ComparisonHeader community1={community1} community2={community2} />
      <div className='mx-5 my-6 max-w-screen-xl md:my-16'>
        <ComparisonModificationCard currentCommunity={community1} comparedWith={community2} />

        <HeaderComparison community1={community1} community2={community2} />

        {/* Sections dynamiques avec Suspense pour streaming */}
        <Suspense fallback={<TransparencySkeleton />}>
          <TransparencyComparison siren1={community1.siren} siren2={community2.siren} />
        </Suspense>

        <Suspense fallback={<DataTableSkeleton title='Marchés publics' />}>
          <MPSubvComparison
            community1={community1}
            community2={community2}
            comparisonType={ComparisonType.Marches_Publics}
          />
        </Suspense>

        <Suspense fallback={<DataTableSkeleton title='Subventions' />}>
          <MPSubvComparison
            community1={community1}
            community2={community2}
            comparisonType={ComparisonType.Subventions}
          />
        </Suspense>
      </div>
    </>
  );
}
