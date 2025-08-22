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
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);

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
    <div className='flex min-h-[calc(100vh-80px)] w-full flex-col overflow-y-auto lg:flex-row lg:overflow-visible'>
      {/* Mobile: Controls at top */}
      <div className='order-1 flex w-full flex-shrink-0 flex-col bg-white lg:order-2 lg:hidden'>
        {/* Mobile Filters Toggle Button */}
        <div className='flex items-center justify-between border-b border-gray-200 p-4'>
          <h3 className='text-lg font-semibold text-primary'>Filtres</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='rounded-tl-br border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10'
          >
            {showFilters ? 'Masquer' : 'Afficher'} filtres
          </button>
        </div>
      </div>

      {/* Mobile: Collapsible Filters - Pushes content down */}
      {showFilters && (
        <div className='order-1 flex w-full flex-shrink-0 flex-col border-b border-gray-200 bg-white lg:hidden'>
          <div className='flex flex-col gap-4 p-4'>
            <TransparencyScoreControls
              selectedScore={selectedScore}
              setSelectedScore={setSelectedScore}
            />
            <FrenchTerritoriesSelect
              territories={territories}
              selectedTerritory={selectedTerritory}
              onSelectTerritory={setSelectedTerritory}
            />
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
      )}

      {/* Map container */}
      <div className='order-2 flex h-[calc(100vh-80px)] w-full items-center justify-center bg-white lg:order-1 lg:h-full lg:w-2/3 lg:flex-1'>
        <FranceMap
          selectedTerritoryData={selectedTerritoryData}
          selectedChoroplethData={selectedChoroplethData}
          viewState={viewState}
          setViewState={setViewState}
          ranges={ranges}
          selectedRangeOption={selectedRangeOption}
          currentAdminLevel={currentAdminLevel}
          populationMinMax={populationMinMax}
          showLegend={showLegend}
          setShowLegend={setShowLegend}
        />
      </div>

      {/* Desktop: Controls on the right */}
      <div className='order-3 hidden w-1/3 flex-col gap-12 bg-white px-8 py-8 lg:flex'>
        <TransparencyScoreControls
          selectedScore={selectedScore}
          setSelectedScore={setSelectedScore}
        />
        <FrenchTerritoriesSelect
          territories={territories}
          selectedTerritory={selectedTerritory}
          onSelectTerritory={setSelectedTerritory}
        />
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
