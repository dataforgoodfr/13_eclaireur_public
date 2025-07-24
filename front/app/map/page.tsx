import type { Metadata } from 'next';

import MapLayout from '@/components/Map/MapLayout';
import type { CollectiviteMinMax } from '@/components/Map/types';
import { getQueryFromPool } from '@/utils/db';

export const metadata: Metadata = {
  title: 'Cartographie',
  description:
    'Carte interactive affichant les données des collectivités pour mieux comprendre la répartition géographique des dépenses publiques et la transparence des collectivités.',
};

export default async function MapPage() {
  const query = `SELECT
  CASE type
    WHEN 'COM' THEN 'commune'
    WHEN 'REG' THEN 'region'
    WHEN 'DEP' THEN 'departement'
  END AS type,
  MIN(population) AS min_population,
  MAX(population) AS max_population
FROM collectivites
GROUP BY type;`;
  const minMaxValues = (await getQueryFromPool(query)) as CollectiviteMinMax[];
  return (
    <div className='flex w-full flex-row'>
      <MapLayout minMaxValues={minMaxValues} />
    </div>
  );
}
