'use client'

import { TransparencyScoreBar } from '@/components/TransparencyScore/TransparencyScore';
import Loading from '@/components/ui/Loading';
import SectionSeparator from '@/components/utils/SectionSeparator';
import { useTransparencyScore } from '@/utils/hooks/comparison/useTransparencyScore';

type TransparenceComparisonProperties = {
  siren1: string;
  siren2: string;
};

export function TransparenceComparison({ siren1, siren2 }: TransparenceComparisonProperties) {
  return (
    <>
      <SectionSeparator sectionTitle='Scores de transparence (2024)' />
      <div className='flex justify-around'>
        <ComparingScore siren={siren1} />
        <ComparingScore siren={siren2} />
      </div>
    </>
  );
}

type ComparingScoreProperties = {
  siren: string;
};

function ComparingScore({ siren }: ComparingScoreProperties) {
  const { data, isPending, isError } = useTransparencyScore(siren, 2024);

  if (isPending || isError) {
    return <Loading />;
  }

  return (
    <div className='flex-col text-center'>
      <p>Transparence des subventions</p>
      <TransparencyScoreBar score={data.subventions_score} />
      <p>Transparence des marchés publics</p>
      <TransparencyScoreBar score={data.mp_score} />
    </div>
  );
}
