'use client';

import { useSubventionYearlyAmounts } from '#utils/hooks/useSubventionYearlyAmounts';
import { useSubventionYearlyCounts } from '#utils/hooks/useSubventionYearlyCounts';
import { EvolutionChart } from '../EvolutionChart';

type SubventionsChartProps = {
  siren: string;
  displayMode: 'amounts' | 'counts';
};

export function SubventionsChart({ 
  siren, 
  displayMode
}: SubventionsChartProps) {
  const { data: amountsData, isPending: amountsPending, isError: amountsError } = useSubventionYearlyAmounts(siren);
  const { data: countsData, isPending: countsPending, isError: countsError } = useSubventionYearlyCounts(siren);

  const isAmountsMode = displayMode === 'amounts';
  const isPending = isAmountsMode ? amountsPending : countsPending;
  const isError = isAmountsMode ? amountsError : countsError;
  const data = isAmountsMode ? amountsData : countsData;

  return (
    <EvolutionChart
      siren={siren}
      displayMode={displayMode}
      chartType="subventions"
      data={data}
      isPending={isPending}
      isError={isError}
    />
  );
}