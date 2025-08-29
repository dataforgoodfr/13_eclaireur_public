'use client';

import { TransparencyScoreBar } from '#components/TransparencyScore/TransparencyScoreBar';
import { SCORE_NON_DISPONIBLE, SCORE_TO_ADJECTIF } from '#components/TransparencyScore/constants';
import SectionSeparator from '#components/utils/SectionSeparator';
import { useTransparencyScore } from '#utils/hooks/comparison/useTransparencyScore';

import { useComparisonYear } from './hooks/useComparisonYear';
import { SideBySideComparison } from './shared/SideBySideComparison';

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
      <SideBySideComparison
        leftChild={<ComparingScore siren={siren1} year={selectedYear as number} />}
        rightChild={<ComparingScore siren={siren2} year={selectedYear as number} />}
        className='max-md:my-6 md:my-10'
      />
    </>
  );
}

type ComparingScoreProperties = {
  siren: string;
  year: number;
};

function ComparingScore({ siren, year }: ComparingScoreProperties) {
  const { data, isPending, isError } = useTransparencyScore(siren, year);

  return (
    <div className='flex flex-col items-center justify-center gap-4 text-center md:gap-8'>
      <div>
        <h3 className='mb-2'>Transparence des subventions</h3>
        <div className='max-md:hidden'>
          <TransparencyScoreBar
            score={data?.subventions_score || null}
            isPending={isPending}
            isError={isError}
          />
        </div>
        <p className='md:hidden'>
          <strong>
            {data?.subventions_score !== null && data?.subventions_score !== undefined
              ? data.subventions_score.toString()
              : SCORE_NON_DISPONIBLE}
          </strong>
          {data?.subventions_score !== null && data?.subventions_score !== undefined && (
            <span> : {SCORE_TO_ADJECTIF[data.subventions_score]}</span>
          )}
        </p>
      </div>

      <div>
        <h3 className='mb-2'>Transparence des marchés publics</h3>
        <div className='max-md:hidden'>
          <TransparencyScoreBar
            score={data?.mp_score || null}
            isPending={isPending}
            isError={isError}
          />
        </div>
        <p className='md:hidden'>
          <strong>
            {data?.mp_score !== null && data?.mp_score !== undefined
              ? data.mp_score.toString()
              : SCORE_NON_DISPONIBLE}
          </strong>
          {data?.mp_score !== null && data?.mp_score !== undefined && (
            <span> : {SCORE_TO_ADJECTIF[data.mp_score]}</span>
          )}
        </p>
      </div>
    </div>
  );
}
