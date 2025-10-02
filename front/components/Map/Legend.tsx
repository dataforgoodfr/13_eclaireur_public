import {
  SCORE_TRANSPARENCY_COLOR,
  TransparencyScore,
} from '#components/TransparencyScore/constants';
import { X } from 'lucide-react';

export default function ChoroplethLegend({
  populationMinMax,
  selectedRangeOption,
  onClose,
}: {
  populationMinMax: { min: number; max: number };
  selectedRangeOption: string;
  onClose?: () => void;
}) {
  const grades = [
    TransparencyScore.A,
    TransparencyScore.B,
    TransparencyScore.C,
    TransparencyScore.D,
    TransparencyScore.E,
  ];

  return (
    <div className='absolute left-4 top-4 z-20 flex max-w-[calc(100vw-32px)] flex-col gap-2 rounded-tl-br border border-gray-200 bg-white/95 px-4 py-3 shadow-lg lg:max-w-none'>
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className='absolute right-2 top-2 rounded-full p-1 hover:bg-gray-100 lg:hidden'
        >
          <X className='h-4 w-4 text-gray-500' />
        </button>
      )}
      <h4 className='mb-1'>Légende</h4>
      <div className='flex flex-col gap-2'>
        <p className='font-kanit-bold text-[14px] font-bold text-primary lg:text-base'>
          Indice de transparence
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
      <div>
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
      </div>
    </div>
  );
}
