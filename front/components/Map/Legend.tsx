import { TransparencyScore, SCORE_TRANSPARENCY_COLOR } from '#components/TransparencyScore/constants';

export default function ChoroplethLegend({
  populationMinMax,
  selectedRangeOption,
}: {
  populationMinMax: { min: number; max: number };
  selectedRangeOption: string;
}) {
  const grades = [
    TransparencyScore.A,
    TransparencyScore.B,
    TransparencyScore.C,
    TransparencyScore.D,
    TransparencyScore.E,
  ];

  return (
    <div className="absolute left-4 top-4 z-20 flex flex-col gap-2 rounded-tl-br border border-gray-200 bg-white/95 px-4 py-3 shadow-lg">
      <h4 className="mb-1">Légende</h4>
      <div className="flex flex-row gap-x-4">
        <p className="text-[14px] font-bold font-kanit-bold text-primary">
          Indices de transparences
        </p>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row items-center gap-2">
       {grades.map((score, idx) => {
              const isEdge = idx === 0 || idx === grades.length - 1;
              return (
                <div
                  key={score}
                  className={`${isEdge ? 'h-12 w-12' : 'h-10 w-10'} rounded-tl-br flex items-center justify-center ${SCORE_TRANSPARENCY_COLOR[score as TransparencyScore]}`}
                  title={score}
                >
                  <span className={`font-kanit-bold ${isEdge ? 'text-[30px]' : 'text-[28px]'} font-bold leading-[24px]`}>
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full flex items-center justify-between">
            <span className="text-primary font-kanit-bold text-[16px]">Exemplaire</span>
            <span className="text-primary font-kanit-bold text-[16px]">Très insuffisant</span>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-1 text-[14px] font-bold font-kanit-bold text-primary capitalize">
          {selectedRangeOption}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[16px] text-primary font-kanit-bold font-medium">
            Min: {(Math.round(populationMinMax.min / 100) * 100).toLocaleString('fr-FR')}
          </span>
          <span className="text-[16px] text-primary font-kanit-bold font-medium">-</span>
          <span className="text-[16px] text-primary font-kanit-bold font-medium">
            Max: {(Math.round(populationMinMax.max / 100) * 100).toLocaleString('fr-FR')}
          </span>
        </div>
      </div>
    </div>
  );
}