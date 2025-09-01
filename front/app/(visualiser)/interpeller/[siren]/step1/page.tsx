// import Link from 'next/link';
import { Suspense } from 'react';

import { FicheIdentite } from '#app/community/[siren]/components/FicheIdentite/FicheIdentite';
import { FicheIdentiteSkeleton } from '#app/community/[siren]/components/Skeletons/FicheIdentiteSkeleton';
import { TransparencySkeleton } from '#app/community/[siren]/components/Skeletons/TransparencySkeleton';
import { TransparencyScoreWithTrend } from '#app/community/[siren]/components/TransparencyScore/TransparencyScore';
import CommunityBasics from '#components/Communities/CommunityBasics';
import ButtonBackAndForth from '#components/Interpellate/ButtonBackAndForth';
import Stepper from '#components/Interpellate/Stepper';
import { TransparencyScore } from '#components/TransparencyScore/constants';
import { fetchCommunities } from '#utils/fetchers/communities/fetchCommunities-server';
import { fetchMostRecentTransparencyScore } from '#utils/fetchers/communities/fetchTransparencyScore-server';

type CommunityPageProps = { params: Promise<{ siren: string }> };

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
export default async function InterpellateStep1({ params }: CommunityPageProps) {
  const { siren } = await params;
  const community = await getCommunity(siren);

  const score = community.transparencyScore || TransparencyScore.UNKNOWN;
  const trend = 1;

  return (
    <>
      <div className='bg-muted-border pb-32'>
        <Stepper currentStep={1} />
      </div>
      <section className='global-margin mb-16 mt-[-7rem]'>
        <article className='mx-4 rounded-3xl border border-primary-light shadow'>
          <div
            id='header-article'
            className='align-center flex flex-col justify-between gap-8 rounded-t-3xl bg-[url(/eclaireur/project_background.webp)] bg-bottom px-8 py-12 md:flex-row md:gap-0'
          >
            <CommunityBasics community={community} />
            <ButtonBackAndForth linkto={`/interpeller/${siren}/step2`} direction='forth'>
              Continuer
            </ButtonBackAndForth>
          </div>

          <Suspense fallback={<FicheIdentiteSkeleton />}>
            <FicheIdentite community={community} className='border-0 shadow-none' />
          </Suspense>

          <Suspense fallback={<TransparencySkeleton />}>
            <TransparencyScoreWithTrend
              score={score}
              trend={trend}
              className='border-b-1 rounded-b-3xl border-0 shadow-none'
            />
          </Suspense>
        </article>
      </section>
    </>
  );
}
