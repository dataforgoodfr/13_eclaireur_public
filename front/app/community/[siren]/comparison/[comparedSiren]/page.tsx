import type { Metadata } from 'next';

import { fetchCommunities } from '#utils/fetchers/communities/fetchCommunities-server';

import { ComparisonType } from './components/ComparisonType';
import { HeaderComparison } from './components/HeaderComparison';
import { MPSubvComparison } from './components/MPSubvComparison';
import { TransparencyComparison } from './components/TransparencyComparison';
import { ComparisonHeader } from './components/shared/ComparisonHeader';
import { ComparisonModificationCard } from './components/shared/ComparisonModificationCard';

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
      <div className='mx-auto mb-6 mt-4 flex max-w-screen-lg flex-col items-stretch justify-center gap-y-6 px-4 lg:mb-16 lg:mt-16 lg:gap-y-16'>
        <ComparisonModificationCard currentCommunity={community1} comparedWith={community2} />

        <HeaderComparison community1={community1} community2={community2} />

        {/* Sections dynamiques avec Suspense pour streaming */}
        <TransparencyComparison siren1={community1.siren} siren2={community2.siren} />

        <MPSubvComparison
          community1={community1}
          community2={community2}
          comparisonType={ComparisonType.Marches_Publics}
        />

        <MPSubvComparison
          community1={community1}
          community2={community2}
          comparisonType={ComparisonType.Subventions}
        />
      </div>
    </>
  );
}
