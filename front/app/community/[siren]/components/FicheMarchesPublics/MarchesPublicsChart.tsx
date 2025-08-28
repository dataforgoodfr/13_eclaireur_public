'use client';

import { useMarchesPublicsYearlyAmounts } from '#utils/hooks/useMarchesPublicsYearlyAmounts';
import { useMarchesPublicsYearlyCounts } from '#utils/hooks/useMarchesPublicsYearlyCounts';

import { EvolutionChart } from '../EvolutionChart';

type MarchesPublicsChartProps = {
  siren: string;
  displayMode: 'amounts' | 'counts';
};

export function MarchesPublicsChart({ siren, displayMode }: MarchesPublicsChartProps) {
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
      siren={siren}
      displayMode={displayMode}
      chartType='marches-publics'
      data={data}
      isPending={isPending}
      isError={isError}
    />
  );
}
