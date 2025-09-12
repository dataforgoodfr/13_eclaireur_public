import { CommunityType } from '#utils/types';
import { getSortedCommunityTypes, stringifyCommunityType } from '#utils/utils';

import { useFilterOptions } from '../../hooks/useFilterOptions';
import { useFiltersParams } from '../../hooks/useFiltersParams';
import { Selector } from './Selector';

const fallbackOptions = Object.values(CommunityType);

export function SelectCommunityType() {
  const {
    filters: { type, population, mp_score, subventions_score },
    setFilter,
  } = useFiltersParams();

  const { data: filterOptions } = useFilterOptions({
    population,
    mp_score,
    subventions_score,
  });

  const options = filterOptions?.types.length
    ? getSortedCommunityTypes(filterOptions.types)
    : getSortedCommunityTypes(fallbackOptions);

  function handleChange(value: string | null) {
    setFilter('type', value);
  }

  function stringifyType(type: string | null) {
    if (type == null) return 'Tout';

    return stringifyCommunityType(type as CommunityType);
  }

  return (
    <Selector
      options={options}
      value={type ?? null}
      label='Type de collectivité'
      placeholder='Choisissez un type'
      onChange={handleChange}
      getOptionLabel={stringifyType}
    />
  );
}
