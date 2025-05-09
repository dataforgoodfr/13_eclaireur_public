import { Suspense } from 'react';

import type { Metadata } from 'next';


import Loading from '@/components/ui/Loading';
import { fetchCommunities } from '@/utils/fetchers/communities/fetchCommunities-server';

import { ComparingFiche } from './ComparingFiche/ComparingFiche';
import { Header } from './Header/Header';

type PageProps = { params: Promise<{ siren: string; comparedSiren: string }> };

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
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

  const community = await getCommunity(siren);
  const community2 = await getCommunity(siren2);

  return (
    <Suspense key={community.siren + community2.siren} fallback={<Loading />}>
      <Header community={community} community2={community2} />
      <div className='m-10 flex justify-center gap-4'>
        <ComparingFiche community={community} />
        <ComparingFiche community={community2} />
      </div>
    </Suspense>
  );
}
