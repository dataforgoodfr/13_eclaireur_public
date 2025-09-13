import type React from 'react';

import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import { TransparencyScoreBar } from '#components/TransparencyScore/TransparencyScoreBar';
import type { TransparencyScore } from '#components/TransparencyScore/constants';
import { SCORE_DESCRIPTION, SCORE_TO_ADJECTIF } from '#components/TransparencyScore/constants';
import { Equal, TrendingDown, TrendingUp } from 'lucide-react';

import { FicheCard } from '../FicheCard';

const mainTitle = 'Score de transparence agrégé';

const trendToText: Record<
  string,
  {
    text: string;
    icon:
      | React.ComponentType<{
          size?: number;
          color?: string;
          className?: string;
        }>
      | undefined;
    color: string;
  }
> = {
  Stable: { text: 'Transparence stable', icon: Equal, color: 'bg-muted-light' },
  'En baisse': { text: 'Transparence en baisse', icon: TrendingDown, color: 'bg-red-200' },
  'En hausse': { text: 'Transparence en hausse', icon: TrendingUp, color: 'bg-brand-2' },
};

type TransparencyScoreProps = {
  score: TransparencyScore;
  trend: string;
  className?: string;
};

const TransparencyScoreWithTrendHeader = ({ trend }: { trend: string }) => {
  const {
    text: trendText,
    icon: TrendIcon,
    color: trendColor,
  } = trendToText[trend] || trendToText.Stable;

  return (
    <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
      <div className='order-2 flex items-center gap-2 sm:order-1'>
        <h2 className='text-3xl font-extrabold text-primary md:text-4xl'>{mainTitle}</h2>
      </div>
      <div className='order-1 mb-2 sm:order-2 sm:mb-0 md:mb-4'>
        <BadgeCommunity text={trendText} icon={TrendIcon} className={trendColor} />
      </div>
    </div>
  );
};

export function TransparencyScoreWithTrend({ score, trend, className }: TransparencyScoreProps) {
  return (
    <div>
      <FicheCard header={<TransparencyScoreWithTrendHeader trend={trend} />} className={className}>
        <div className='flex w-full flex-col gap-6 md:flex-row'>
          {/* md:gap-16 */}
          <section className='flex w-full flex-col items-center gap-6 md:w-1/2'>
            <TransparencyScoreBar score={score} />
          </section>
          <section className='flex w-full flex-col items-center gap-6 md:w-1/2'>
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
