import { CommunityType } from '@/utils/types';

import { useFiltersParams } from '../../hooks/useFiltersFromSearchParams';
import { Selector } from './Selector';

export function SelectCommunityType() {
  const {
    filters: { type },
    setFilter,
  } = useFiltersParams();

  function handleChange(value: string | null) {
    setFilter('type', value);
  }

  const options = Object.values(CommunityType);

  return (
    <Selector
      options={options}
      value={type ?? null}
      label='Type de collectivite'
      placeholder='Choisissez un type'
      onChange={handleChange}
    />
  );
}
