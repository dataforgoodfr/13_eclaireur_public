import Link from 'next/link';

import BadgeCommunity from '@/components/Communities/BadgeCommunity';
import BudgetGlobal from '@/components/Communities/BudgetGlobal';
import MiniFicheCommunity from '@/components/Communities/MiniFicheCommunity';
import RankingCommunity from '@/components/Communities/RankingCommunity';
import { TransparencyScoreBar } from '@/components/TransparencyScore/TransparencyScore';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoveRight } from 'lucide-react';

export default async function InterpellateStep1({
  params,
}: {
  params: Promise<{ siren: string }>;
}) {
  const { siren } = await params;
  const buttonClassName = `buttonVariants({
            variant: 'outline',
            className: 'min-w-[200] bg-black text-white',
          })`;
  // TODO - retrieve scores
  const scores = { subventions: TransparencyScore.E, marchesPublics: TransparencyScore.B };
  const trends = { subventions: 1, marchesPublics: 0.01 };

  return (
    <section>
      <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>Collectivité sélectionnée</h2>
      <article className='px-8 py-12 outline'>
        <div className='flex justify-between'>
          <BadgeCommunity name='exemplaire' />
          <BudgetGlobal communityName='Nantes' />
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
        <Link
          href='/interpeller'
          className={buttonClassName}
        >
          <ChevronLeft /> Revenir
        </Link>
        <Link
          href={`/interpeller/${siren}/step2`}
          className={buttonClassName}
        >
          Continuer <ChevronRight />
        </Link>
      </div>
    </section>
  );
}
