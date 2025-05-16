'use client';

import { useState, useEffect } from 'react';
import type { ViewState } from 'react-map-gl/maplibre';

import FrenchTerritoriesSelect from './FrenchTerritorySelect';
import FranceMap from './Map';
import MapDataControls from './MapDataControls';


export type ChoroplethDataSource = {
  name: string;
  dataName: string;
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
};

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
  const [selectedDataSource, setSelectedDataSource] = useState<string>('mp_score');
  const [viewState, setViewState] = useState<Partial<ViewState>>(
    territories['metropole'].viewState
  );
  const selectedTerritoryData = selectedTerritory ? territories[selectedTerritory] : undefined;
  const selectedChoroplethData = choroplethDataSource[selectedDataSource];
  // Update viewState when selectedTerritory changes
  useEffect(() => {
    if (selectedTerritory && territories[selectedTerritory]) {
      setViewState(territories[selectedTerritory].viewState);
    }
  }, [selectedTerritory]);
  return (
    <div className='flex min-h-screen w-full'>
      {/* Map: 2/3 width, plain white bg, no border */}
      <div className='flex w-2/3 items-center justify-center bg-white'>
        <FranceMap
          selectedTerritoryData={selectedTerritoryData}
          selectedChoroplethData={selectedChoroplethData}
          viewState={viewState}
          setViewState={setViewState}
        />
      </div>
      {/* Controls: 1/3 width, orange bg */}
      <div className='min-h-screen w-1/3 bg-[#ffeccf] p-8'>
        <div>
          <MapDataControls
            selectedDataSource={selectedDataSource}
            setSelectedDataSource={setSelectedDataSource}
          />
        </div>
        <div className='mb-6'>
          <FrenchTerritoriesSelect
            territories={territories}
            selectedTerritory={selectedTerritory}
            onSelectTerritory={setSelectedTerritory}
          />
        </div>
      </div>
    </div>
  );
}
