'use client';

import EvolutionContainer from '#components/DataViz/EvolutionContainer';
import { useMarchesPublicsYearlyAmounts } from '#utils/hooks/useMarchesPublicsYearlyAmounts';
import { useMarchesPublicsYearlyCounts } from '#utils/hooks/useMarchesPublicsYearlyCounts';

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
  } = useMarchesPublicsYearlyAmounts(siren);

  const {
    data: countsData,
    isPending: countsPending,
    isError: countsError,
  } = useMarchesPublicsYearlyCounts(siren);

  return (
    <EvolutionContainer
      siren={siren}
      communityName={communityName}
      dataType='marches-publics'
      amountsData={amountsData}
      countsData={countsData}
      isAmountsPending={amountsPending}
      isCountsPending={countsPending}
      isAmountsError={amountsError}
      isCountsError={countsError}
    />
  );
}
