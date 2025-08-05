import { TransparencyScoreBar } from '#components/TransparencyScore/TransparencyScore';
import type { TransparencyScore } from '#components/TransparencyScore/constants';
import { SCORE_DESCRIPTION, SCORE_TO_ADJECTIF } from '#components/TransparencyScore/constants';
import { TrendingDown, TrendingUp } from 'lucide-react';

import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import React from 'react';
import { FicheCard } from '../FicheCard';

const mainTitle = 'Score de transparence agrégé';

function trendToText(trend: number, margin = 0.01) {
  if (trend <= margin && trend >= -margin) return { text: '= Transparence inchangée', icon: null };
  if (trend < margin) return { text: 'Transparence en baisse', icon: <TrendingDown className="h-4 w-4" /> };
  return { text: 'Transparence en hausse', icon: <TrendingUp className="h-4 w-4" /> };
}

type TransparencyScoreProps = {
  score: TransparencyScore;
  trend: number;
};

const TransparencyScoreWithTrendHeader = ({ trend }: { trend: number }) => {
  const { text: trendText, icon: TrendIcon } = trendToText(trend);

  const trendColor = trendText === 'Transparence en hausse' ? 'bg-brand-2' :
    trendText === 'Transparence en baisse' ? 'bg-red-200' : 'bg-gray-200';

  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
      <div className="flex items-center gap-2">
        <h2 className='text-3xl md:text-4xl font-extrabold text-primary'>
          {mainTitle}
        </h2>
      </div>
      <BadgeCommunity
        text={trendText}
        icon={TrendIcon ? (props: any) => React.cloneElement(TrendIcon, { ...props, className: "h-4 w-4" }) : undefined}
        className={trendColor}
      />
    </div>
  );
};
export function TransparencyScoreWithTrend({ score, trend }: TransparencyScoreProps) {
  return (
    <div className=''>
      <FicheCard header={<TransparencyScoreWithTrendHeader trend={trend} />}>
        <div className='mb-10 flex flex-col md:flex-row w-full gap-6'>
          <section className='w-full md:w-1/2 flex flex-col gap-6'>
            <TransparencyScoreBar score={score} />
          </section>
          <section className='w-full md:w-1/2 flex flex-col gap-6'>
            <TransparenceScoreDescription title={`Score ${score} - ${SCORE_TO_ADJECTIF[score]}`} description={SCORE_DESCRIPTION[score] || 'Aucune donnée disponible'} />
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
    <div className="flex flex-col gap-2">
      <h3 className="text-2xl md:text-3xl font-bold text-primary">{title}</h3>
      <p className="text-lg text-gray-600">
        {description}
      </p>
    </div>
  );
}
