import { TransparencyScore } from '@/components/TransparencyScore/constants';

import { useFiltersParams } from '../../hooks/useFiltersFromSearchParams';
import { Selector } from './Selector';

export function SelectSubventionsScore() {
  const {
    filters: { subventions_score },
    setFilter,
  } = useFiltersParams();

  function handleChange(value: TransparencyScore | null) {
    setFilter('subventions_score', value);
  }

  const options = Object.values(TransparencyScore);

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
