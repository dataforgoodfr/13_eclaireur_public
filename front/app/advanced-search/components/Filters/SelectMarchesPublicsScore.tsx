import { TransparencyScore } from '#components/TransparencyScore/constants';

import { useFilterOptions } from '../../hooks/useFilterOptions';
import { useFiltersParams } from '../../hooks/useFiltersParams';
import { Selector } from './Selector';

export function SelectMarchesPublicsScore() {
  const {
    filters: { mp_score, type, population, subventions_score },
    setFilter,
  } = useFiltersParams();

  const { data: filterOptions } = useFilterOptions({
    type,
    population,
    subventions_score,
  });

  function handleChange(value: TransparencyScore | null) {
    setFilter('mp_score', value);
  }

  const fallbackOptions = Object.values(TransparencyScore);
  const options = filterOptions?.mpScores.length 
    ? filterOptions.mpScores 
    : fallbackOptions;

  return (
    <Selector
      label='Marchés Publics'
      placeholder='Choisissez un score'
      options={options}
      value={mp_score ?? null}
      onChange={handleChange}
    />
  );
}
