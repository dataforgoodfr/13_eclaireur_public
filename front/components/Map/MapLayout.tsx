'use client';

import { useState } from 'react';
import type { ViewState } from 'react-map-gl/maplibre';

import FrenchTerritoriesSelect from './FrenchTerritorySelect';
import FranceMap from './Map';

// Define the territory data type
export type TerritoryData = {
  name: string;
  viewState: Partial<ViewState>;
  regionsMaxZoom: number;
  departementsMaxZoom: number;
  communesMaxZoom: number;
  filterCode: string;
};

export const territories: Record<string, TerritoryData> = {
  metropole: {
    name: 'France Metropole',
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

export default function MapLayout() {
  const [selectedTerritory, setSelectedTerritory] = useState<string | undefined>('metropole');

  // The currently selected territory data or undefined if nothing selected
  const selectedTerritoryData = selectedTerritory ? territories[selectedTerritory] : undefined;

  return (
    <>
      <div className='min-h-screen'>
        <FranceMap selectedTerritoryData={selectedTerritoryData} />
      </div>
      <div>
        <h2>Select France Metropole or Overseas Territory</h2>
        <div>
          <FrenchTerritoriesSelect
            territories={territories}
            selectedTerritory={selectedTerritory}
            onSelectTerritory={setSelectedTerritory}
          />
        </div>
      </div>
    </>
  );
}
