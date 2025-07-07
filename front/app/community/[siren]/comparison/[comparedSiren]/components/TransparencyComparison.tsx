'use client';

import { useState } from 'react';

import { TransparencyScoreBar } from '@/components/TransparencyScore/TransparencyScore';
import Loading from '@/components/ui/Loading';
import SectionSeparator from '@/components/utils/SectionSeparator';
import { useTransparencyScore } from '@/utils/hooks/comparison/useTransparencyScore';

import { YearOption } from '../../../types/interface';

type TransparencyComparisonProperties = {
  siren1: string;
  siren2: string;
};

export function TransparencyComparison({ siren1, siren2 }: TransparencyComparisonProperties) {
  const defaultYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<YearOption>(defaultYear);

  return (
    <>
      <SectionSeparator
        sectionTitle='Scores de transparence'
        year={selectedYear}
        onSelectYear={setSelectedYear}
      />
      <div className='flex justify-around'>
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
      <TransparencyScoreBar score={data.subventions_score} />
      <p>Transparence des marchés publics</p>
      <TransparencyScoreBar score={data.mp_score} />
    </div>
  );
}
