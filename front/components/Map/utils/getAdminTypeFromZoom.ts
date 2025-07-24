// or wherever it's defined
import { territories } from '../constants';
import type { AdminType } from '../types';

// adjust the import path as necessary

export default function getAdminTypeFromZoom(zoom: number, territoryCode: string): AdminType {
  const territory = territories[territoryCode];
  if (!territory) return 'region'; // default fallback

  if (zoom < territory.regionsMaxZoom) {
    return 'region';
  } else if (zoom < territory.departementsMaxZoom) {
    return 'departement';
  } else {
    return 'commune';
  }
}
