import Link from 'next/link';

import BadgeCommunity from '#components/Communities/BadgeCommunity';
import BudgetGlobal from '#components/Communities/BudgetGlobal';
import MiniFicheCommunity from '#components/Communities/MiniFicheCommunity';
import RankingCommunity from '#components/Communities/RankingCommunity';
import ButtonBackAndForth from '#components/Interpellate/ButtonBackAndForth';
import Stepper from '#components/Interpellate/Stepper';
import { TransparencyScoreBar } from '#components/TransparencyScore/TransparencyScoreBar';
import { TransparencyScore } from '#components/TransparencyScore/constants';
import { MoveRight } from 'lucide-react';

export default async function InterpellateStep1({
  params,
}: {
  params: Promise<{ siren: string }>;
}) {
  const { siren } = await params;
  // TODO - retrieve scores
  const scores = { subventions: TransparencyScore.E, marchesPublics: TransparencyScore.B };
  // const trends = { subventions: 1, marchesPublics: 0.01 };

  return (
    <section className='my-16'>
      <Stepper currentStep={1} />

      <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>Collectivité sélectionnée</h2>
      <article className='px-8 py-12 outline'>
        <div className='flex justify-between'>
          <BadgeCommunity isExemplaire={true} />
          <BudgetGlobal communitySiren={siren} />
        </div>
        <div className='mt-10 flex flex-col justify-between md:flex-row'>
          <MiniFicheCommunity communitySiren={siren} />
          <div className='min-w-1/4 md:scale-[0.85]'>
            <h3 className='pl-5 font-bold'>Marchés publics</h3>
            <TransparencyScoreBar score={scores.marchesPublics} />
          </div>
          <div className='min-w-1/4 md:scale-[0.85]'>
            <h3 className='pl-5 font-bold'>Subventions</h3>
            <TransparencyScoreBar score={scores.subventions} />
          </div>
        </div>
        <div className='flex justify-between'>
          <RankingCommunity communityName='Nantes' />
          <Link className='flex items-end gap-2 hover:underline' href={`/community/${siren}`}>
            Voir la fiche de la collectivité <MoveRight />
          </Link>
        </div>
      </article>
      <div className='my-12 flex justify-center gap-4'>
        <ButtonBackAndForth linkto='/interpeller' direction='back'>
          Revenir
        </ButtonBackAndForth>
        <ButtonBackAndForth linkto={`/interpeller/${siren}/step2`} direction='forth'>
          Continuer
        </ButtonBackAndForth>
      </div>
    </section>
  );
}
