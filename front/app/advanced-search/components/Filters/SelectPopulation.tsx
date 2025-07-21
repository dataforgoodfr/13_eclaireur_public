import { formatNumber } from '#utils/utils';

import { useFiltersParams } from '../../hooks/useFiltersParams';
import { Selector } from './Selector';

const options = [2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 2_000_000];

export function SelectPopulation() {
  const {
    filters: { population },
    setFilter,
  } = useFiltersParams();

  function handleChange(value: number | null) {
    setFilter('population', value?.toString() ?? null);
  }

  function formatNullNumber(value: number | null) {
    if (value == null) return 'Tout';
    return formatNumber(value);
  }

  return (
    <Selector
      label='Population inférieure à'
      placeholder='Choisissez un nombre'
      options={options}
      value={population ?? null}
      onChange={handleChange}
      getOptionLabel={formatNullNumber}
    />
  );
}
