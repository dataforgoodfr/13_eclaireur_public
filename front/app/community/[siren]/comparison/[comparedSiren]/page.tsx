import { Suspense } from 'react';

import type { Metadata } from 'next';

import Loading from '@/components/ui/Loading';
import { fetchCommunities } from '@/utils/fetchers/communities/fetchCommunities-server';

import { Header } from './components/Header';
import { HeaderComparison } from './components/HeaderComparison';
import { MarchesPublicsComparison } from './components/MarchesPublicsComparison';
import { SubventionsComparison } from './components/SubventionsComparison';
import { TransparenceComparison } from './components/TransparenceComparison';

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

  const community1 = await getCommunity(siren);
  const community2 = await getCommunity(siren2);

  return (
    <Suspense key={community1.siren + community2.siren} fallback={<Loading />}>
      <Header community={community1} community2={community2} />
      <div className='mx-5 mx-auto my-3 max-w-screen-xl'>
        <HeaderComparison community1={community1} community2={community2} />
        <TransparenceComparison community1={community1} community2={community2} />
        {/* TODO factoriser en un seul composant les encarts marchés publics et subventions
            A faire si le comportement général est validé fonctionnellement */}
        <MarchesPublicsComparison siren1={community1.siren} siren2={community2.siren} />
        <SubventionsComparison siren1={community1.siren} siren2={community2.siren} />
      </div>
    </Suspense>
  );
}
