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
  populationMinMax,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedRangeOption,
  onClose,
  selectedScore,
  selectedYear,
  adminLevel,
}: {
  populationMinMax: { min: number; max: number };
  selectedRangeOption: string;
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
    <div className='absolute left-4 top-4 z-20 flex max-w-[calc(100vw-32px)] flex-col gap-2 rounded-tl-br border border-gray-200 bg-white/95 px-4 py-3 shadow-lg lg:max-w-none'>
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

      {/* Population bubbles section */}
      <div className='mt-3 flex flex-col gap-2 border-t border-gray-200 pt-3'>
        <p className='font-kanit-bold text-[14px] font-bold text-primary lg:text-base'>
          Population (habitants)
        </p>
        <div className='flex flex-row items-end justify-between gap-2'>
          {/* Min population */}
          <div className='flex flex-col items-center gap-1'>
            <div className='flex h-8 w-full items-center justify-center'>
              <div
                className='rounded-full'
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.4)',
                }}
              />
            </div>
            <span className='font-kanit-bold text-xs text-primary lg:text-sm'>
              {(Math.round(populationMinMax.min / 100) * 100).toLocaleString('fr-FR')}
            </span>
          </div>
          {/* Mid population */}
          <div className='flex flex-col items-center gap-1'>
            <div className='flex h-8 w-full items-center justify-center'>
              <div
                className='rounded-full'
                style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid #1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.4)',
                }}
              />
            </div>
            <span className='font-kanit-bold text-xs text-primary lg:text-sm'>
              {(
                Math.round((populationMinMax.min + populationMinMax.max) / 2 / 100) * 100
              ).toLocaleString('fr-FR')}
            </span>
          </div>
          {/* Max population */}
          <div className='flex flex-col items-center gap-1'>
            <div className='flex h-8 w-full items-center justify-center'>
              <div
                className='rounded-full'
                style={{
                  width: '32px',
                  height: '32px',
                  border: '2px solid #1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.4)',
                }}
              />
            </div>
            <span className='font-kanit-bold text-xs text-primary lg:text-sm'>
              {(Math.round(populationMinMax.max / 100) * 100).toLocaleString('fr-FR')}
            </span>
          </div>
        </div>
      </div>

      {/* Feature flag: Mettez en perspective - currently hidden */}
      {/* <div>
        <div className='mb-1 font-kanit-bold text-[14px] font-bold capitalize text-primary'>
          {selectedRangeOption}
        </div>
        <div className='flex flex-col items-start gap-1 text-xs lg:flex-row lg:items-center lg:gap-2 lg:text-base'>
          <span className='font-kanit-bold font-medium text-primary'>
            Min: {(Math.round(populationMinMax.min / 100) * 100).toLocaleString('fr-FR')}
          </span>
          <span className='hidden font-kanit-bold font-medium text-primary lg:inline'>-</span>
          <span className='font-kanit-bold font-medium text-primary'>
            Max: {(Math.round(populationMinMax.max / 100) * 100).toLocaleString('fr-FR')}
          </span>
        </div>
      </div> */}
    </div>
  );
}
