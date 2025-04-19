import { CommunityType } from '@/utils/types';

import { useFiltersParams } from '../../hooks/useFiltersFromSearchParams';
import { Selector } from './Selector';

const options = Object.values(CommunityType);

function stringifyCommunityType(type: CommunityType): string {
  if (type === CommunityType.CA) return `Communaute d'agglomerations`;
  if (type === CommunityType.CC) return 'Communaute de communes';
  if (type === CommunityType.CTU) return 'Collectivite territoriale unique';
  if (type === CommunityType.Commune) return 'Commune';
  if (type === CommunityType.Departement) return 'Departement';
  if (type === CommunityType.EPT) return 'Etablissement public territorial';
  if (type === CommunityType.Metropole) return 'Metropole';
  if (type === CommunityType.Region) return 'Region';

  throw new Error(`Type ${type} not supported`);
}

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
