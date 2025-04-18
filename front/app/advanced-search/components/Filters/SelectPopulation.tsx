import { useFiltersParams } from '../../hooks/useFiltersFromSearchParams';
import { Selector } from './Selector';

export function SelectPopulation() {
  const {
    filters: { population },
    setFilter,
  } = useFiltersParams();

  function handleChange(value: number | null) {
    setFilter('population', value?.toString() ?? null);
  }

  const options = [2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 2_000_000];

  return (
    <Selector
      label='Population inferieur a'
      placeholder='Choisissez un nombre'
      options={options}
      value={population ?? null}
      onChange={handleChange}
    />
  );
}
