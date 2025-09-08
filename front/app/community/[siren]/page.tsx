import { Suspense } from 'react';

import type { Metadata } from 'next';

import { fetchCommunityBudgetTotal } from '#utils/fetchers/communities-accounts/fetchCommunityBudgetTotal';
import { fetchCommunities } from '#utils/fetchers/communities/fetchCommunities-server';
import { fetchSimilarCommunityList } from '#utils/fetchers/communities/fetchSimilarCommunityList-server';
import { fetchMostRecentTransparencyScore } from '#utils/fetchers/communities/fetchTransparencyScore-server';
import type { CommunityType } from '#utils/types';
import { TransparencyScore } from '@/components/TransparencyScore/constants';

import { FicheHeader } from './components/FicheHeader/FicheHeader';
import { FicheIdentite } from './components/FicheIdentite/FicheIdentite';
import { FicheMarchesPublics } from './components/FicheMarchesPublics/FicheMarchesPublics';
import { FicheSubventions } from './components/FicheSubventions/FicheSubventions';
import { FicheIdentiteSkeleton } from './components/Skeletons/FicheIdentiteSkeleton';
import { TransparencyScoreWithTrend } from './components/TransparencyScore/TransparencyScore';

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

  const { aggregatedScore } = await fetchMostRecentTransparencyScore(siren);

  return {
    ...communitiesResults[0],
    transparencyScore: aggregatedScore,
  };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const siren = (await params).siren;

  const community = await getCommunity(siren);
  const budgetTotal = await fetchCommunityBudgetTotal(siren);
  const similarCommunityList = await fetchSimilarCommunityList(siren);

  // TODO - get and add the last update date
  // const lastUpdateText = `Derniere mise a jour`;
  const score = community.transparencyScore || TransparencyScore.UNKNOWN;
  const trend = 1;

  return (
    <>
      <FicheHeader community={community} similarCommunityList={similarCommunityList} />
      <div className='mx-auto mb-6 mt-4 flex max-w-screen-lg flex-col items-stretch justify-center gap-y-6 px-4 lg:mb-16 lg:mt-16 lg:gap-y-16'>
        <Suspense fallback={<FicheIdentiteSkeleton />}>
          <FicheIdentite community={community} budgetTotal={budgetTotal} />
        </Suspense>
        <TransparencyScoreWithTrend score={score} trend={trend} />
        <FicheMarchesPublics
          siren={siren}
          communityType={community.type as CommunityType}
          communityName={community.nom}
        />
        <FicheSubventions
          siren={siren}
          communityType={community.type as CommunityType}
          communityName={community.nom}
        />
      </div>
    </>
  );
}
