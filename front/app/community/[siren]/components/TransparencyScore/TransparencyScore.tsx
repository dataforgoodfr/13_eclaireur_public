import { TransparencyScoreBar } from '#components/TransparencyScore/TransparencyScore';
import type { TransparencyScore } from '#components/TransparencyScore/constants';
import { TrendingDown, TrendingUp } from 'lucide-react';



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
  const trendColor = trendText === 'Transparence en hausse' ? 'bg-lime-200' : trendText === 'Transparence en baisse' ? 'bg-red-200' : 'bg-gray-200';

  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
      <div className="flex items-center gap-2">
        <h2 className='text-3xl md:text-4xl font-extrabold text-primary'>
          {mainTitle}
        </h2>
      </div>
      <span className={`text-xs sm:text-sm px-3 py-1 mt-2 sm:mt-0 rounded-full text-primary font-bold flex items-center gap-1 ${trendColor}`}>
        {TrendIcon && TrendIcon} {trendText}
      </span>
    </div>
  );
};

export function TransparencyScoreWithTrend({ score, trend }: TransparencyScoreProps) {
  return (
    <FicheCard header={<TransparencyScoreWithTrendHeader trend={trend} />}>
      <div className='mt-6'>
        <TransparencyScoreBar score={score} />
      </div>
    </FicheCard>
  );
}
