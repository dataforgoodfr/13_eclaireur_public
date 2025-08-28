'use client';

import { RefObject } from 'react';

import { useMarchesPublicsYearlyAmounts } from '#utils/hooks/useMarchesPublicsYearlyAmounts';
import { useMarchesPublicsYearlyCounts } from '#utils/hooks/useMarchesPublicsYearlyCounts';

import { EvolutionChart } from '../EvolutionChart';

type MarchesPublicsChartProps = {
  siren: string;
  displayMode: 'amounts' | 'counts';
  ref?: RefObject<HTMLDivElement | null>;
};

export function MarchesPublicsChart({ siren, displayMode, ref }: MarchesPublicsChartProps) {
  const {
    data: amountsData,
    isPending: amountsPending,
    isError: amountsError,
  } = useMarchesPublicsYearlyAmounts(siren);
  const {
    data: countsData,
    isPending: countsPending,
    isError: countsError,
  } = useMarchesPublicsYearlyCounts(siren);

  const isAmountsMode = displayMode === 'amounts';
  const isPending = isAmountsMode ? amountsPending : countsPending;
  const isError = isAmountsMode ? amountsError : countsError;
  const data = isAmountsMode ? amountsData : countsData;

  return (
    <EvolutionChart
      ref={ref}
      siren={siren}
      displayMode={displayMode}
      chartType='marches-publics'
      data={data}
      isPending={isPending}
      isError={isError}
    />
  );
}
