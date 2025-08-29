'use client';

import { TransparencyScoreBar } from '#components/TransparencyScore/TransparencyScoreBar';
import { SCORE_NON_DISPONIBLE, SCORE_TO_ADJECTIF } from '#components/TransparencyScore/constants';
import Loading from '#components/ui/Loading';
import SectionSeparator from '#components/utils/SectionSeparator';
import { useTransparencyScore } from '#utils/hooks/comparison/useTransparencyScore';

import { useComparisonYear } from './hooks/useComparisonYear';

type TransparencyComparisonProperties = {
  siren1: string;
  siren2: string;
};

export function TransparencyComparison({ siren1, siren2 }: TransparencyComparisonProperties) {
  const { year: selectedYear, setYear: setSelectedYear } = useComparisonYear();

  return (
    <>
      <SectionSeparator
        sectionTitle='Scores de transparence'
        year={selectedYear}
        onSelectYear={setSelectedYear}
      />
      <div className='flex justify-around max-md:my-6 md:my-10'>
        <ComparingScore siren={siren1} year={selectedYear as number} />
        <ComparingScore siren={siren2} year={selectedYear as number} />
      </div>
    </>
  );
}

type ComparingScoreProperties = {
  siren: string;
  year: number;
};

function ComparingScore({ siren, year }: ComparingScoreProperties) {
  const { data, isPending, isError } = useTransparencyScore(siren, year);

  if (isPending || isError) {
    return <Loading />;
  }

  return (
    <div className='flex-col text-center'>
      <p>Transparence des subventions</p>
      <div className='max-md:hidden'>
        <TransparencyScoreBar score={data.subventions_score} />
      </div>
      <p className='md:hidden'>
        <strong>
          {data.subventions_score !== null
            ? data.subventions_score.toString()
            : SCORE_NON_DISPONIBLE}
        </strong>
        {data.subventions_score !== null && (
          <span> : {SCORE_TO_ADJECTIF[data.subventions_score]}</span>
        )}
      </p>
      <p>Transparence des marchés publics</p>
      <div className='max-md:hidden'>
        <TransparencyScoreBar score={data.mp_score} />
      </div>
      <p className='md:hidden'>
        <strong>{data.mp_score !== null ? data.mp_score.toString() : SCORE_NON_DISPONIBLE}</strong>
        {data.mp_score !== null && <span> : {SCORE_TO_ADJECTIF[data.mp_score]}</span>}
      </p>
    </div>
  );
}
