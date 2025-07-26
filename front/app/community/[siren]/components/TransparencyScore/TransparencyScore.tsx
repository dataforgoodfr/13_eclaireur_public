import { TransparencyScoreBar } from '#components/TransparencyScore/TransparencyScore';
import { TransparencyScore } from '#components/TransparencyScore/constants';
import { Badge } from '#components/ui/badge';
import { Trophy } from 'lucide-react';

import TooltipScore from './TooltipScore';

const mainTitle = 'Score de transparence agrégé';

function trendToText(trend: number, margin = 0.01) {
  if (trend <= margin && trend >= -margin) return '= Transparence inchangée';

  if (trend < margin) return 'Transparence en baisse';

  return 'Transparence en hausse';
}

type TrendBadgeProps = {
  value: number;
  /**
   * Margin to determine trend text
   */
  margin?: number;
};

function TrendBadge({ value, margin }: TrendBadgeProps) {
  return (
    <Badge variant='outline' className='rounded-2xl p-2'>
      {trendToText(value, margin)}
    </Badge>
  );
}

type TransparencyScoreProps = {
  score: TransparencyScore;
  trend: number;
};

export function TransparencyScoreWithTrend({ score, trend }: TransparencyScoreProps) {
  return (
    <div className='mx-auto flex max-w-screen-md flex-col items-center justify-between'>
      <div className='flex items-center gap-4 text-xl font-bold'>
        <Trophy />
        <p>{mainTitle}</p>
        <TooltipScore />
      </div>
      <div className='mt-6 flex flex-col justify-between md:flex-row'>
        <div className='flex flex-col items-center gap-y-2'>
          <TransparencyScoreBar score={score} />
          <TrendBadge value={trend} />
        </div>
      </div>
    </div>
  );
}
