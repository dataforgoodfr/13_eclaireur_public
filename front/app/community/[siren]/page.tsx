import { Suspense } from 'react';

import Loading from '@/components/ui/Loading';
import { fetchCommunities } from '@/utils/fetchers/communities/fetchCommunities-server';

import { ErrorBoundary } from './components/ErrorBoundary';
import { FicheHeader } from './components/FicheHeader/FicheHeader';
import { FicheIdentite } from './components/FicheIdentite/FicheIdentite';
import { FicheMarchesPublics } from './components/FicheMarchesPublics/FicheMarchesPublics';
import { FicheSubventions } from './components/FicheSubventions/FicheSubventions';

type CommunityPageProps = { params: Promise<{ siren: string }> };

async function getCommunity(siren: string) {
  const communitiesResults = await fetchCommunities({ filters: { siren } });

  if (communitiesResults.length === 0) {
    throw new Error(`Community doesnt exist with siren ${siren}`);
  }

  return communitiesResults[0];
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const siren = (await params).siren;

  // const community = await getCommunity(siren);

  return (
    <Suspense fallback={<Loading />}>
    {/* <Suspense key={community.siren} fallback={<Loading />}>
      <FicheHeader community={community} />
      <FicheIdentite community={community} /> */}
      <ErrorBoundary>
        <FicheMarchesPublics siren={siren} />
      </ErrorBoundary>
      <ErrorBoundary>
        <FicheSubventions siren={siren} />
      </ErrorBoundary>
    </Suspense>
  );
}
