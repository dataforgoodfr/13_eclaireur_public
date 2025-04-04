import { Suspense } from 'react';

import Loading from '@/components/ui/Loading';
import { fetchCommunities } from '@/utils/fetchers/communities/fetchCommunities-server';
import { fetchMarchesPublics } from '@/utils/fetchers/marches-publics/fetchMarchesPublics-server';

import { FicheHeader } from './components/FicheHeader/FicheHeader';
import { FicheIdentite } from './components/FicheIdentite/FicheIdentite';
import { FicheMarchesPublics } from './components/FicheMarchesPublics/FicheMarchesPublics';

type CommunityPageProps = { params: Promise<{ siren: string }> };

async function getCommunity(siren: string) {
  const communitiesResults = await fetchCommunities({ filters: { siren } });

  if (communitiesResults.length === 0) {
    throw new Error(`Community doesnt exist with siren ${siren}`);
  }

  return communitiesResults[0];
}

async function getMarchesPublics(siren: string) {
  const marchesPublicsResults = await fetchMarchesPublics({ acheteur_siren: siren });

  if (marchesPublicsResults.length === 0) {
    throw new Error(`Community doesnt exist with siren ${siren}`);
  }

  return marchesPublicsResults;
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const siren = (await params).siren;

  const community = await getCommunity(siren);
  const marchesPublics = await getMarchesPublics(siren);

  return (
    <Suspense key={community.siren} fallback={<Loading />}>
      <FicheHeader community={community} />
      <FicheIdentite community={community} />
      <FicheMarchesPublics marchesPublics={marchesPublics} />
    </Suspense>
  );
}
