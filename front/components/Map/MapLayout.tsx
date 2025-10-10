'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MapRef, ViewState } from 'react-map-gl/maplibre';

import type { Community } from '#app/models/community';
import { DEFAULT_MAP_YEAR } from '#utils/constants/years';
import { useCommunes } from '#utils/hooks/map/useCommunes';
import { useDepartements } from '#utils/hooks/map/useDepartements';
import { useRegions } from '#utils/hooks/map/useRegions';

import AdminLevelSlider from './AdminLevelSlider';
import FranceMap from './FranceMap';
import FrenchTerritoriesSelect from './FrenchTerritorySelect';
import MapSearch from './MapSearch';
import MapTooltip from './MapTooltip';
// import PerspectiveSelector from './PerspectiveSelector'; // Feature flag: currently hidden
import TransparencyScoreControls from './TransparencyScoreControls';
import YearSelector from './YearSelector';
import { choroplethDataSource, territories } from './constants';
import type { HoverInfo } from './types';
import getAdminTypeFromZoom from './utils/getAdminTypeFromZoom';
import { getAvailableLevels, getDefaultLevelForZoom } from './utils/getAvailableLevels';
import { updateVisibleCodes } from './utils/updateVisibleCodes';

export default function MapLayout() {
  const [selectedTerritory, setSelectedTerritory] = useState<string | undefined>('metropole');
  const [selectedScore, setSelectedScore] = useState<string>('mp_score');
  const [selectedYear, setSelectedYear] = useState<number>(DEFAULT_MAP_YEAR);
  const [selectedAdminLevel, setSelectedAdminLevel] = useState<
    'regions' | 'departements' | 'communes' | null
  >(null);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
  const [visibleRegionCodes, setVisibleRegionCodes] = useState<string[]>([]);
  const [visibleDepartementCodes, setVisibleDepartementCodes] = useState<string[]>([]);
  const [visibleCommuneCodes, setVisibleCommuneCodes] = useState<string[]>([]);

  const [viewState, setViewState] = useState<Partial<ViewState>>(territories.metropole.viewState);

  // Store mapRef from FranceMap to trigger visible codes update after search
  const mapRefFromChild = useRef<React.RefObject<MapRef | null> | null>(null);

  const selectedTerritoryData = selectedTerritory ? territories[selectedTerritory] : undefined;
  const selectedChoroplethData = choroplethDataSource[selectedScore];
  const currentAdminLevel = getAdminTypeFromZoom(
    viewState.zoom || 5,
    selectedTerritory || 'metropole',
  );

  // Calculate available levels based on current zoom
  const availableLevels = useMemo((): ('regions' | 'departements' | 'communes')[] => {
    if (selectedTerritoryData) {
      return getAvailableLevels(viewState.zoom || 5, selectedTerritoryData);
    }
    return ['regions', 'departements', 'communes'];
  }, [selectedTerritoryData, viewState.zoom]);

  // Fetch community data
  const { data: communes } = useCommunes(visibleCommuneCodes, selectedYear);
  const { data: departements } = useDepartements(visibleDepartementCodes, selectedYear);
  const { data: regions } = useRegions(visibleRegionCodes, selectedYear);

  // Build community map
  const communityMap = useMemo(() => {
    const map: Record<string, Community> = {};
    for (const c of regions ?? []) {
      const regionCode = c.code_insee_region;
      if (regionCode) map[`region-${regionCode}`] = c;
    }
    for (const c of departements ?? []) {
      const deptCode = c.code_insee;
      if (deptCode) map[`departement-${deptCode}`] = c;
    }
    for (const c of communes ?? []) {
      const communeCode = c.code_insee;
      if (communeCode) map[`commune-${communeCode}`] = c;
    }
    return map;
  }, [regions, departements, communes]);

  // Detect mobile device
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Callback to receive mapRef from FranceMap
  const handleMapRefCallback = useCallback((ref: React.RefObject<MapRef | null>) => {
    mapRefFromChild.current = ref;
  }, []);

  // Callback to trigger visible codes update after search
  const handleSearchComplete = useCallback(() => {
    const mapInstance = mapRefFromChild.current?.current?.getMap();
    if (!mapInstance) return;

    updateVisibleCodes(
      mapInstance,
      selectedTerritoryData?.filterCode || 'FR',
      setVisibleRegionCodes,
      setVisibleDepartementCodes,
      setVisibleCommuneCodes,
    );
  }, [selectedTerritoryData]);

  // Update viewState when selectedTerritory changes
  useEffect(() => {
    if (selectedTerritory && territories[selectedTerritory]) {
      setViewState(territories[selectedTerritory].viewState);
    }
  }, [selectedTerritory]);

  // Auto-adjust selected admin level if it becomes unavailable
  useEffect(() => {
    if (selectedAdminLevel && !availableLevels.includes(selectedAdminLevel)) {
      // Find the closest available level
      const defaultLevel =
        selectedTerritoryData && getDefaultLevelForZoom(viewState.zoom || 5, selectedTerritoryData);
      if (defaultLevel && availableLevels.includes(defaultLevel)) {
        setSelectedAdminLevel(defaultLevel);
      } else if (availableLevels.length > 0) {
        setSelectedAdminLevel(availableLevels[0] as 'regions' | 'departements' | 'communes');
      }
    }
  }, [availableLevels, selectedAdminLevel, selectedTerritoryData, viewState.zoom]);

  return (
    <div className='relative flex min-h-[calc(100vh-80px)] w-full flex-col overflow-y-auto lg:flex-row lg:overflow-visible'>
      {/* Tooltip at highest level to avoid any clipping */}
      <MapTooltip
        hoverInfo={hoverInfo}
        communityMap={communityMap}
        isMobile={isMobile}
        onClose={() => setHoverInfo(null)}
      />
      {/* Mobile: Controls at top */}
      <div className='order-1 flex w-full flex-shrink-0 flex-col bg-white lg:order-2 lg:hidden'>
        {/* Mobile Filters Toggle Button */}
        <div className='flex items-center justify-between border-b border-gray-200 p-4'>
          <h3 className='text-lg font-semibold text-primary'>Filtres</h3>
          <button
            type='button'
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
            <YearSelector selectedYear={selectedYear} onSelectYear={setSelectedYear} />
            <FrenchTerritoriesSelect
              territories={territories}
              selectedTerritory={selectedTerritory}
              onSelectTerritory={setSelectedTerritory}
            />
            {/* Feature flag: Mettez en perspective - currently hidden */}
            {/* <PerspectiveSelector
              minMaxValues={minMaxValues}
              currentAdminLevel={currentAdminLevel}
              selectedOption={selectedRangeOption}
              onSelectedOptionChange={setSelectedRangeOption}
              ranges={ranges}
              onRangeChange={handleRangeChange}
            /> */}
          </div>
        </div>
      )}

      {/* Map container */}
      <div className='relative order-2 flex h-[calc(100vh-80px)] w-full items-center justify-center overflow-visible bg-white lg:order-1 lg:h-full lg:w-2/3 lg:flex-1'>
        {/* Search bar - positioned at top left */}
        <div className='absolute left-4 top-4 z-40 w-auto max-w-[calc(100vw-32px)] lg:w-[282px] lg:max-w-none'>
          <MapSearch setViewState={setViewState} onSearchComplete={handleSearchComplete} />
        </div>
        <AdminLevelSlider
          selectedLevel={selectedAdminLevel || 'regions'}
          onLevelChange={setSelectedAdminLevel}
          availableLevels={availableLevels}
        />

        <FranceMap
          selectedTerritoryData={selectedTerritoryData}
          selectedChoroplethData={selectedChoroplethData}
          viewState={viewState}
          setViewState={setViewState}
          currentAdminLevel={currentAdminLevel}
          showLegend={showLegend}
          setShowLegend={setShowLegend}
          selectedYear={selectedYear}
          manualAdminLevel={selectedAdminLevel}
          setHoverInfo={setHoverInfo}
          communityMap={communityMap}
          visibleRegionCodes={visibleRegionCodes}
          visibleDepartementCodes={visibleDepartementCodes}
          visibleCommuneCodes={visibleCommuneCodes}
          setVisibleRegionCodes={setVisibleRegionCodes}
          setVisibleDepartementCodes={setVisibleDepartementCodes}
          setVisibleCommuneCodes={setVisibleCommuneCodes}
          mapRefCallback={handleMapRefCallback}
        />
      </div>

      {/* Desktop: Controls on the right */}
      <div
        className={`relative order-3 hidden flex-col gap-12 overflow-visible bg-white transition-all duration-300 lg:flex ${
          showSidebar ? 'w-1/3 px-8 py-8' : 'w-0 px-0 py-8'
        }`}
      >
        {/* Toggle Button - Always visible */}
        <button
          type='button'
          onClick={() => setShowSidebar(!showSidebar)}
          className={`absolute top-1/2 z-50 min-w-[20px] -translate-y-1/2 rounded-sm border border-gray-300 bg-white p-2 shadow-md transition-all hover:bg-gray-50 ${
            showSidebar ? '-left-3' : '-left-7'
          }`}
          aria-label={showSidebar ? 'Masquer les filtres' : 'Afficher les filtres'}
        >
          {showSidebar ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2.5}
              stroke='currentColor'
              className='h-3 w-3'
              aria-hidden='true'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2.5}
              stroke='currentColor'
              className='h-3 w-3'
              aria-hidden='true'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
            </svg>
          )}
        </button>

        {/* Sidebar Content */}
        {showSidebar && (
          <>
            <TransparencyScoreControls
              selectedScore={selectedScore}
              setSelectedScore={setSelectedScore}
            />
            <YearSelector selectedYear={selectedYear} onSelectYear={setSelectedYear} />
            <FrenchTerritoriesSelect
              territories={territories}
              selectedTerritory={selectedTerritory}
              onSelectTerritory={setSelectedTerritory}
            />
            {/* Feature flag: Mettez en perspective - currently hidden */}
            {/* <PerspectiveSelector
          minMaxValues={minMaxValues}
          currentAdminLevel={currentAdminLevel}
          selectedOption={selectedRangeOption}
          onSelectedOptionChange={setSelectedRangeOption}
          ranges={ranges}
          onRangeChange={handleRangeChange}
        /> */}
          </>
        )}
      </div>
    </div>
  );
}
