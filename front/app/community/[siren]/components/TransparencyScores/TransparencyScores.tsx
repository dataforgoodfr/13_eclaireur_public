import { TransparencyScoreBar } from '@/components/TransparencyScore/TransparencyScore';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

const mainTitle = 'Scores de transparence';
const subventionsLabel = 'Subventions';
const marchesPublicsLabel = 'Marchés Publics ';

function trendToText(trend: number, margin = 0.01) {
  if (trend <= margin && trend >= -margin) return '= Tendance égale';

  if (trend < margin) return 'Tendance à la baisse';

  return 'Tendance à la hausse';
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

type TransparencyScoresProps = {
  scores: {
    subventions: TransparencyScore;
    marchesPublics: TransparencyScore;
  };
  trends: {
    subventions: number;
    marchesPublics: number;
  };
};

export function TransparencyScores({ scores, trends }: TransparencyScoresProps) {
  return (
    <div className='mx-auto flex max-w-screen-md flex-col items-center justify-between'>
      <div className='flex items-center gap-4 text-xl font-bold'>
        <Trophy />
        <p>{mainTitle}</p>
      </div>
      <div className='mt-10 flex flex-col justify-between md:flex-row'>
        <div className='flex flex-col items-center gap-y-2'>
          <span className='font-bold'>{marchesPublicsLabel}</span>
          <TransparencyScoreBar score={scores.marchesPublics} />
          <TrendBadge value={trends.marchesPublics} />
        </div>
        <div className='flex flex-col items-center gap-2'>
          <span className='font-bold'>{subventionsLabel}</span>
          <TransparencyScoreBar score={scores.subventions} />
          <TrendBadge value={trends.subventions} />
        </div>
      </div>
    </div>
  );
}
