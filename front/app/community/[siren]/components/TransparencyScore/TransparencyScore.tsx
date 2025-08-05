import React from 'react';

import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import { TransparencyScoreBar } from '#components/TransparencyScore/TransparencyScoreBar';
import type { TransparencyScore } from '#components/TransparencyScore/constants';
import { SCORE_DESCRIPTION, SCORE_TO_ADJECTIF } from '#components/TransparencyScore/constants';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { FicheCard } from '../FicheCard';

const mainTitle = 'Score de transparence agrégé';

function trendToText(trend: number, margin = 0.01) {
  if (trend <= margin && trend >= -margin) return { text: '= Transparence inchangée', icon: null };
  if (trend < margin)
    return { text: 'Transparence en baisse', icon: <TrendingDown className='h-4 w-4' /> };
  return { text: 'Transparence en hausse', icon: <TrendingUp className='h-4 w-4' /> };
}

type TransparencyScoreProps = {
  score: TransparencyScore;
  trend: number;
};

const TransparencyScoreWithTrendHeader = ({ trend }: { trend: number }) => {
  const { text: trendText, icon: TrendIcon } = trendToText(trend);

  const trendColor =
    trendText === 'Transparence en hausse'
      ? 'bg-brand-2'
      : trendText === 'Transparence en baisse'
        ? 'bg-red-200'
        : 'bg-muted-light';

  return (
    <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
      <div className='flex items-center gap-2 order-2 sm:order-1'>
        <h2 className='text-3xl font-extrabold text-primary md:text-4xl'>{mainTitle}</h2>
      </div>
      <div className="order-1 sm:order-2 md:mb-4 mb-2 sm:mb-0">

        <BadgeCommunity
          text={trendText}
          icon={
            TrendIcon
              ? (props: React.SVGProps<SVGSVGElement>) => React.cloneElement(TrendIcon, { ...props, className: 'h-4 w-4' })
              : undefined
          }
          className={trendColor}
        />
      </div>
    </div>
  );
};
export function TransparencyScoreWithTrend({ score, trend }: TransparencyScoreProps) {
  return (
    <div className=''>
      <FicheCard header={<TransparencyScoreWithTrendHeader trend={trend} />}>
        <div className='flex w-full flex-col gap-6 md:flex-row'>
          {/* md:gap-16 */}
          <section className='flex w-full flex-col gap-6 md:w-1/2 items-center'>
            <TransparencyScoreBar score={score} />
          </section>
          <section className='flex w-full flex-col gap-6 md:w-1/2 items-center'>
            <TransparenceScoreDescription
              title={`Score ${score} - ${SCORE_TO_ADJECTIF[score]}`}
              description={SCORE_DESCRIPTION[score] || 'Aucune donnée disponible'}
            />
          </section>
        </div>
      </FicheCard>
    </div>
  );
}

interface TransparenceScoreDescriptionProps {
  title: string;
  description: string;
}

function TransparenceScoreDescription({ title, description }: TransparenceScoreDescriptionProps) {
  return (
    <div className='flex flex-col gap-2'>
      <h3 className='text-2xl font-bold text-primary md:text-3xl'>{title}</h3>
      <p className='text-lg text-primary'>{description}</p>
    </div>
  );
}
