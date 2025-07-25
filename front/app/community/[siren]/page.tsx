import { Suspense } from 'react';

import type { Metadata } from 'next';

import { fetchCommunities } from '#utils/fetchers/communities/fetchCommunities-server';

import { ErrorBoundary } from '../../../components/utils/ErrorBoundary';
import { FicheHeader } from './components/FicheHeader/FicheHeader';
import { FicheIdentite } from './components/FicheIdentite/FicheIdentite';
import { FicheMarchesPublics } from './components/FicheMarchesPublics/FicheMarchesPublics';
import { FicheSubventions } from './components/FicheSubventions/FicheSubventions';
import { FicheIdentiteSkeleton } from './components/Skeletons/FicheIdentiteSkeleton';
import { FicheMarchesPublicsSkeleton } from './components/Skeletons/FicheMarchesPublicsSkeleton';
import { FicheSubventionsSkeleton } from './components/Skeletons/FicheSubventionsSkeleton';

type CommunityPageProps = { params: Promise<{ siren: string }> };

export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const siren = (await params).siren;
  const community = await getCommunity(siren);

  return {
    title: community.nom,
    description: `Visualiser les dernières données de dépenses publiques de la collectivite : ${community.nom}`,
  };
}

async function getCommunity(siren: string) {
  const communitiesResults = await fetchCommunities({ filters: { siren } });

  if (communitiesResults.length === 0) {
    throw new Error(`Community doesnt exist with siren ${siren}`);
  }

  return communitiesResults[0];
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const siren = (await params).siren;

  const community = await getCommunity(siren);

  return (
    <>
      <FicheHeader community={community} />
      <div className='mx-auto mt-[140px] flex max-w-screen-lg flex-col items-stretch justify-center gap-y-10 p-10'>
        <Suspense fallback={<FicheIdentiteSkeleton />}>
          <FicheIdentite community={community} />
        </Suspense>
        <Suspense fallback={<FicheMarchesPublicsSkeleton />}>
          <ErrorBoundary>
            <FicheMarchesPublics siren={siren} />
          </ErrorBoundary>
        </Suspense>
        <Suspense fallback={<FicheSubventionsSkeleton />}>
          <ErrorBoundary>
            <FicheSubventions siren={siren} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </>
  );
}
