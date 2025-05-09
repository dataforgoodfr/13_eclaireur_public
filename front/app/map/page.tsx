
import type { Metadata } from 'next';

import MapLayout from '@/components/Map/MapLayout';

export const metadata: Metadata = {
  title: 'Cartographie',
  description: 'Carte interactive affichant les données des collectivités pour mieux comprendre la répartition géographique des dépenses publiques et la transparence des collectivités.',
};


export default function MapPage() {
  return (
    <div className='flex w-full flex-row'>
    <MapLayout/>
    </div>
  );
}
