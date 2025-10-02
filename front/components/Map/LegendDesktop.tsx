import {
  SCORE_TRANSPARENCY_COLOR,
  TransparencyScore,
} from '#components/TransparencyScore/constants';

export default function LegendDesktop() {
  const grades = [
    TransparencyScore.A,
    TransparencyScore.B,
    TransparencyScore.C,
    TransparencyScore.D,
    TransparencyScore.E,
  ];

  return (
    <div className='mb-4 mb-8 lg:mb-8'>
      <div className='mb-2 mb-4 flex flex-col gap-3 lg:mb-4'>
        <p className='font-kanit-bold text-sm font-bold text-primary lg:text-base'>
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
    </div>
  );
}
