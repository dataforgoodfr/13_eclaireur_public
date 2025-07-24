import type { Community } from '@/app/models/community';

import { MapPointFeatureCollection } from '../types';

export function createMapPointFeatures(points: Community[]): MapPointFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: points
      ?.filter((p) => p.latitude !== null && p.longitude !== null)
      .map((p) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.longitude as number, p.latitude as number],
        },
        properties: {
          id: p.code_insee,
          name: p.nom,
          population: p.population,
        },
      })),
  };
}
