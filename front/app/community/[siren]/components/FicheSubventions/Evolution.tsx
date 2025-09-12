'use client';

import EvolutionContainer from '#components/DataViz/EvolutionContainer';
import { useSubventionYearlyAmounts } from '#utils/hooks/useSubventionYearlyAmounts';
import { useSubventionYearlyCounts } from '#utils/hooks/useSubventionYearlyCounts';

type EvolutionProps = {
  siren: string;
  communityName: string;
};

export default function Evolution({ siren, communityName }: EvolutionProps) {
  // Fetch data with existing hooks
  const {
    data: amountsData,
    isPending: amountsPending,
    isError: amountsError,
  } = useSubventionYearlyAmounts(siren);

  const {
    data: countsData,
    isPending: countsPending,
    isError: countsError,
  } = useSubventionYearlyCounts(siren);

  return (
    <EvolutionContainer
      siren={siren}
      communityName={communityName}
      dataType='subventions'
      amountsData={amountsData}
      countsData={countsData}
      isAmountsPending={amountsPending}
      isCountsPending={countsPending}
      isAmountsError={amountsError}
      isCountsError={countsError}
    />
  );
}
