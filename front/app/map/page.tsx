
import type { Metadata } from 'next';

import Map from '@/components/Map/map';

export const metadata: Metadata = {
  title: 'Cartographie',
  description: 'Carte interactive affichant les données des collectivités pour mieux comprendre la répartition géographique des dépenses publiques et la transparence des collectivités.',
};


export default function MapPage() {
  return (
    <Map></Map>
  );
}
