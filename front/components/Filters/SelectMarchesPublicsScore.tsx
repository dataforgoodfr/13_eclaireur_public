import { TransparencyScore } from '@/components/TransparencyScore/constants';

import { useFiltersParams } from '../../hooks/useFiltersParams';
import { Selector } from './Selector';

export function SelectMarchesPublicsScore() {
  const {
    filters: { mp_score },
    setFilter,
  } = useFiltersParams();

  function handleChange(value: TransparencyScore | null) {
    setFilter('mp_score', value);
  }

  const options = Object.values(TransparencyScore);

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
