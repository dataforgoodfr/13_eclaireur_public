'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ViewState } from 'react-map-gl/maplibre';

import FranceMap from './FranceMap';
import FrenchTerritoriesSelect from './FrenchTerritorySelect';
import PerspectiveSelector from './PerspectiveSelector';
import TransparencyScoreControls from './TransparencyScoreControls';
import { choroplethDataSource, territories } from './constants';
import type { CollectiviteMinMax } from './types';
import getAdminTypeFromZoom from './utils/getAdminTypeFromZoom';
import { createInitialRanges, getMinMaxForAdminLevel } from './utils/perspectiveFunctions';

type MapLayoutProps = {
  minMaxValues: CollectiviteMinMax[];
};

export default function MapLayout({ minMaxValues }: MapLayoutProps) {
  const [selectedTerritory, setSelectedTerritory] = useState<string | undefined>('metropole');
  const [selectedScore, setSelectedScore] = useState<string>('mp_score');
  const [selectedRangeOption, setSelectedRangeOption] = useState<string>('population');

  const [viewState, setViewState] = useState<Partial<ViewState>>(
    territories['metropole'].viewState,
  );

  const selectedTerritoryData = selectedTerritory ? territories[selectedTerritory] : undefined;
  const selectedChoroplethData = choroplethDataSource[selectedScore];
  const currentAdminLevel = getAdminTypeFromZoom(
    viewState.zoom || 5,
    selectedTerritory || 'metropole',
  );

  // Use the external function
  const populationMinMax = getMinMaxForAdminLevel(minMaxValues, currentAdminLevel);

  // Initialize ranges state with external function
  const [ranges, setRanges] = useState<Record<string, [number, number]>>(() =>
    createInitialRanges(populationMinMax.min, populationMinMax.max),
  );

  // Move handleRangeChange to useCallback for better performance
  const handleRangeChange = useCallback((optionId: string, value: [number, number]) => {
    setRanges((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  }, []);

  // Update viewState when selectedTerritory changes
  useEffect(() => {
    if (selectedTerritory && territories[selectedTerritory]) {
      setViewState(territories[selectedTerritory].viewState);
    }
  }, [selectedTerritory]);

  // Update population range when admin level or territory changes
  useEffect(() => {
    setRanges((prev) => ({
      ...prev,
      population: [populationMinMax.min, populationMinMax.max],
    }));
  }, [populationMinMax.min, populationMinMax.max]);

  return (
    <div className='flex min-h-screen w-full'>
      <div className='flex w-2/3 items-center justify-center bg-white'>
        <FranceMap
          selectedTerritoryData={selectedTerritoryData}
          selectedChoroplethData={selectedChoroplethData}
          viewState={viewState}
          setViewState={setViewState}
          ranges={ranges}
          selectedRangeOption={selectedRangeOption}
          // minMaxValues={minMaxValues}
          currentAdminLevel={currentAdminLevel}
          populationMinMax={populationMinMax}
        />
      </div>
      <div className='flex min-h-screen w-1/3 flex-col bg-[#ffeccf] px-8 py-20'>
        <TransparencyScoreControls
          selectedScore={selectedScore}
          setSelectedScore={setSelectedScore}
        />
        <hr className='my-12 border-t border-[#fdc04e]' />
        <FrenchTerritoriesSelect
          territories={territories}
          selectedTerritory={selectedTerritory}
          onSelectTerritory={setSelectedTerritory}
        />
        <hr className='my-12 border-t border-[#fdc04e]' />
        <PerspectiveSelector
          minMaxValues={minMaxValues}
          currentAdminLevel={currentAdminLevel}
          selectedOption={selectedRangeOption}
          onSelectedOptionChange={setSelectedRangeOption}
          ranges={ranges}
          onRangeChange={handleRangeChange}
        />
      </div>
    </div>
  );
}
