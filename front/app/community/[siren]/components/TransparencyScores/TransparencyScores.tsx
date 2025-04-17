import { TransparencyScoreBar } from '@/components/TransparencyScore/TransparencyScore';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Trophy } from 'lucide-react';

const mainTitle = 'Score de transparence agrégé';
// const globalScore = 'Score global';

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

type TransparencyScoresProps = {
  score: {
    globalScore: TransparencyScore;
  };
  trend: {
    globalScore: number;
  };
};

export function TransparencyScores({ score, trend }: TransparencyScoresProps) {
  return (
    <div className='mx-auto flex max-w-screen-md flex-col items-center justify-between'>
      <div className='flex items-center gap-4 text-xl font-bold'>
        <Trophy />
        <p>{mainTitle}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className='-ml-2 mt-1 h-4 w-4' />
            </TooltipTrigger>
            <TooltipContent side='bottom' sideOffset={10}>
              <div className='p-2'>
                <h4>Explication du score de transparence agrégé :</h4>
                <ul className='ml-4 mt-2 list-disc'>
                  <li>Les données sont bien formattées</li>
                  <li>Les données sont complètes</li>
                  <li>Les données sont à jour</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className='mt-6 flex flex-col justify-between md:flex-row'>
        <div className='flex flex-col items-center gap-y-2'>
          <TransparencyScoreBar score={score.globalScore} />
          <TrendBadge value={trend.globalScore} />
        </div>
      </div>
    </div>
  );
}
