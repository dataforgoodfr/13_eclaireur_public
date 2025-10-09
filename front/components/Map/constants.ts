import type { ChoroplethDataSource, TerritoryData } from './types';

export const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILES_API_KEY;

export const BASE_MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#f9f9f9' },
    },
  ],
  glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${MAPTILER_API_KEY}`,
};

export const territories: Record<string, TerritoryData> = {
  metropole: {
    name: 'France métropolitaine',
    viewState: {
      longitude: 2.2137,
      latitude: 46.2276,
      zoom: 5,
    },
    regionsMaxZoom: 6,
    departementsMaxZoom: 8,
    communesMaxZoom: 14,
    filterCode: 'FR',
  },
  reunion: {
    name: 'La Réunion',
    viewState: {
      longitude: 55.5364,
      latitude: -21.1151,
      zoom: 7,
    },
    regionsMaxZoom: 8.5,
    departementsMaxZoom: 10,
    communesMaxZoom: 14,
    filterCode: 'RE',
  },
  guyane: {
    name: 'Guyane',
    viewState: {
      longitude: -53.1258,
      latitude: 3.9339,
      zoom: 6,
    },
    regionsMaxZoom: 7,
    departementsMaxZoom: 7.5,
    communesMaxZoom: 11,
    filterCode: 'GF',
  },
  mayotte: {
    name: 'Mayotte',
    viewState: {
      longitude: 45.1662,
      latitude: -12.8275,
      zoom: 10,
    },
    regionsMaxZoom: 9,
    departementsMaxZoom: 11,
    communesMaxZoom: 13,
    filterCode: 'YT',
  },
  guadeloupe: {
    name: 'Guadeloupe',
    viewState: {
      longitude: -61.551,
      latitude: 16.265,
      zoom: 8,
    },
    regionsMaxZoom: 9,
    departementsMaxZoom: 10.5,
    communesMaxZoom: 13,
    filterCode: 'GP',
  },
  martinique: {
    name: 'Martinique',
    viewState: {
      longitude: -61.0242,
      latitude: 14.6415,
      zoom: 8,
    },
    regionsMaxZoom: 10,
    departementsMaxZoom: 10.5,
    communesMaxZoom: 13,
    filterCode: 'MQ',
  },
};

export const choroplethDataSource: Record<string, ChoroplethDataSource> = {
  subventions_score: {
    name: 'Subventions Score',
    dataName: 'subventions_score',
  },
  mp_score: {
    name: 'Marches Public Score',
    dataName: 'mp_score',
  },
  aggregated_score: {
    name: 'Score Agrégé',
    dataName: 'aggregated_score',
  },
};
