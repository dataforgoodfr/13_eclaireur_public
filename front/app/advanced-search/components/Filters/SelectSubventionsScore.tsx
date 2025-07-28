import { TransparencyScore } from '#components/TransparencyScore/constants';

import { useFilterOptions } from '../../hooks/useFilterOptions';
import { useFiltersParams } from '../../hooks/useFiltersParams';
import { Selector } from './Selector';

export function SelectSubventionsScore() {
  const {
    filters: { subventions_score, type, population, mp_score },
    setFilter,
  } = useFiltersParams();

  const { data: filterOptions } = useFilterOptions({
    type,
    population,
    mp_score,
  });

  function handleChange(value: TransparencyScore | null) {
    setFilter('subventions_score', value);
  }

  const fallbackOptions = Object.values(TransparencyScore);
  const options = filterOptions?.subventionsScores.length 
    ? filterOptions.subventionsScores 
    : fallbackOptions;

  return (
    <Selector
      label='Subventions'
      placeholder='Choisissez un score'
      options={options}
      value={subventions_score ?? null}
      onChange={handleChange}
    />
  );
}
