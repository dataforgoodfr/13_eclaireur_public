import { CommunityType } from '@/utils/types';
import { stringifyCommunityType } from '@/utils/utils';

import { useFiltersParams } from '../../hooks/useFiltersFromSearchParams';
import { Selector } from './Selector';

const options = Object.values(CommunityType);

export function SelectCommunityType() {
  const {
    filters: { type },
    setFilter,
  } = useFiltersParams();

  function handleChange(value: string | null) {
    setFilter('type', value);
  }

  function stringifyType(type: CommunityType | null) {
    if (type == null) return 'Tout';

    return stringifyCommunityType(type);
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
