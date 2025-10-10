import {
  SCORE_TRANSPARENCY_COLOR,
  TransparencyScore,
} from '#components/TransparencyScore/constants';
import { X } from 'lucide-react';

const SCORE_LABELS: Record<string, string> = {
  mp_score: 'Marchés publics',
  subventions_score: 'Subventions',
  aggregated_score: 'Agrégé',
};

const ADMIN_LEVEL_LABELS: Record<string, string> = {
  regions: 'Régions',
  departements: 'Départements',
  communes: 'Communes',
};

export default function ChoroplethLegend({
  onClose,
  selectedScore,
  selectedYear,
  adminLevel,
}: {
  onClose?: () => void;
  selectedScore: string;
  selectedYear: number;
  adminLevel: string;
}) {
  const grades = [
    TransparencyScore.A,
    TransparencyScore.B,
    TransparencyScore.C,
    TransparencyScore.D,
    TransparencyScore.E,
  ];

  const scoreLabel = SCORE_LABELS[selectedScore] || selectedScore;
  const levelLabel = ADMIN_LEVEL_LABELS[adminLevel] || adminLevel;

  return (
    <div className='absolute left-4 top-16 z-20 flex max-w-[calc(100vw-32px)] flex-col gap-2 rounded-tl-br border border-gray-200 bg-white/95 px-4 py-3 shadow-lg lg:max-w-none'>
      {/* Close button for mobile */}
      {onClose && (
        <button
          type='button'
          onClick={onClose}
          className='absolute right-2 top-2 rounded-full p-1 hover:bg-gray-100 lg:hidden'
        >
          <X className='h-4 w-4 text-gray-500' />
        </button>
      )}
      {/* Dynamic title with two lines */}
      <div className=''>
        <h4 className='text-[16px] font-bold text-primary lg:text-[18px]'>
          Score transparence <br /> {scoreLabel}
        </h4>
      </div>
      <div className='flex flex-col gap-1'>
        <p className='font-kanit-bold text-[14px] font-bold text-primary lg:text-base'>
          {levelLabel} · {selectedYear}
        </p>
        <div className='flex flex-col items-center gap-2'>
          <div className='flex flex-row items-center gap-1 lg:gap-2'>
            {grades.map((score, idx) => {
              const isEdge = idx === 0 || idx === grades.length - 1;
              return (
                <div
                  key={score}
                  className={`${isEdge ? 'h-10 w-10 lg:h-12 lg:w-12' : 'h-8 w-8 lg:h-10 lg:w-10'} flex items-center justify-center rounded-tl-br ${SCORE_TRANSPARENCY_COLOR[score as TransparencyScore]}`}
                  title={score}
                >
                  <span
                    className={`font-kanit-bold ${isEdge ? 'text-[24px] lg:text-[30px]' : 'text-[20px] lg:text-[28px]'} font-bold leading-[24px]`}
                  >
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
          <div className='flex w-full items-center justify-between text-xs lg:text-sm'>
            <span className='font-kanit-bold text-primary'>Exemplaire</span>
            <span className='font-kanit-bold text-primary'>Très insuffisant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
