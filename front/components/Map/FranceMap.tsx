'use client';

import { useEffect, useRef } from 'react';
import Map, {
  Layer,
  type MapRef,
  NavigationControl,
  Source,
  type StyleSpecification,
  type ViewState,
} from 'react-map-gl/maplibre';

import type { Community } from '#app/models/community';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import ChoroplethLayer from './ChoroplethLayer';
import ChoroplethLegend from './Legend';
import { BASE_MAP_STYLE, MAPTILER_API_KEY } from './constants';
import type { ChoroplethDataSource, HoverInfo, TerritoryData } from './types';
import updateFeatureStates from './utils/updateFeatureState';
import { updateVisibleCodes } from './utils/updateVisibleCodes';
import { useFranceMapHandlers } from './utils/useFranceMapHanders';

interface MapProps {
  selectedTerritoryData: TerritoryData | undefined;
  selectedChoroplethData: ChoroplethDataSource;
  viewState: Partial<ViewState>;
  setViewState: (vs: Partial<ViewState>) => void;
  currentAdminLevel: string;
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
  selectedYear: number;
  manualAdminLevel: 'regions' | 'departements' | 'communes' | null;
  setHoverInfo: (info: HoverInfo | null) => void;
  communityMap: Record<string, Community>;
  visibleRegionCodes: string[];
  visibleDepartementCodes: string[];
  visibleCommuneCodes: string[];
  setVisibleRegionCodes: (codes: string[]) => void;
  setVisibleDepartementCodes: (codes: string[]) => void;
  setVisibleCommuneCodes: (codes: string[]) => void;
  mapRefCallback?: (ref: React.RefObject<MapRef | null>) => void;
  ranges?: unknown;
  selectedRangeOption?: unknown;
}
const franceMetropoleBounds: [[number, number], [number, number]] = [
  [-15, 35],
  [20, 55],
];

export default function FranceMap({
  selectedTerritoryData,
  selectedChoroplethData,
  viewState,
  setViewState,
  ranges,
  selectedRangeOption,
  currentAdminLevel,
  showLegend,
  setShowLegend,
  selectedYear,
  manualAdminLevel,
  setHoverInfo,
  communityMap,
  visibleRegionCodes,
  visibleDepartementCodes,
  visibleCommuneCodes,
  setVisibleRegionCodes,
  setVisibleDepartementCodes,
  setVisibleCommuneCodes,
  mapRefCallback,
}: MapProps) {
  const mapRef = useRef<MapRef>(null);

  const regionsMaxZoomThreshold = selectedTerritoryData?.regionsMaxZoom || 6;
  const departementsMaxZoomThreshold = selectedTerritoryData?.departementsMaxZoom || 8;
  const communesMaxZoomThreshold = (selectedTerritoryData?.communesMaxZoom || 14) + 1; // +1 because maxzoom is exclusive

  let regionsMinZoom = 0;
  let regionsMaxZoom = regionsMaxZoomThreshold;
  let departementsMinZoom = regionsMaxZoomThreshold;
  let departementsMaxZoom = departementsMaxZoomThreshold;
  let communesMinZoom = departementsMaxZoomThreshold;
  let communesMaxZoom = communesMaxZoomThreshold;

  // Border visibility
  let regionBordersMinZoom = regionsMaxZoomThreshold;
  let regionBordersMaxZoom = communesMaxZoomThreshold;
  let departmentBordersMinZoom = departementsMaxZoomThreshold;
  let departmentBordersMaxZoom = communesMaxZoomThreshold;

  // Override visibility if manual admin level is set
  if (manualAdminLevel) {
    const hideZoom = communesMaxZoomThreshold + 1;

    if (manualAdminLevel === 'regions') {
      // Show regions, hide all borders (no level above)
      regionsMinZoom = 0;
      regionsMaxZoom = communesMaxZoomThreshold;
      departementsMinZoom = hideZoom;
      departementsMaxZoom = hideZoom;
      communesMinZoom = hideZoom;
      communesMaxZoom = hideZoom;
      regionBordersMinZoom = hideZoom;
      departmentBordersMinZoom = hideZoom;
    } else if (manualAdminLevel === 'departements') {
      // Show departements + region borders (level above)
      regionsMinZoom = hideZoom;
      regionsMaxZoom = hideZoom;
      departementsMinZoom = 0;
      departementsMaxZoom = communesMaxZoomThreshold;
      communesMinZoom = hideZoom;
      communesMaxZoom = hideZoom;
      regionBordersMinZoom = 0;
      regionBordersMaxZoom = communesMaxZoomThreshold;
      departmentBordersMinZoom = hideZoom;
    } else if (manualAdminLevel === 'communes') {
      // Show communes + department borders (level above)
      regionsMinZoom = hideZoom;
      regionsMaxZoom = hideZoom;
      departementsMinZoom = hideZoom;
      departementsMaxZoom = hideZoom;
      communesMinZoom = 0;
      communesMaxZoom = communesMaxZoomThreshold;
      regionBordersMinZoom = hideZoom;
      departmentBordersMinZoom = 0;
      departmentBordersMaxZoom = communesMaxZoomThreshold;
    }
  }

  const territoryFilterCode = selectedTerritoryData?.filterCode || 'FR';
  const choroplethParameter = selectedChoroplethData.dataName || 'subventions_score';

  useEffect(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;

    updateFeatureStates(mapInstance, communityMap, choroplethParameter, territoryFilterCode);
  }, [communityMap, choroplethParameter, territoryFilterCode]);

  // Update visible codes when territory changes
  useEffect(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;

    updateVisibleCodes(
      mapInstance,
      territoryFilterCode,
      setVisibleRegionCodes,
      setVisibleDepartementCodes,
      setVisibleCommuneCodes,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [territoryFilterCode]);

  // Expose map ref to parent via callback
  useEffect(() => {
    if (mapRefCallback && mapRef.current) {
      mapRefCallback(mapRef);
    }
  }, [mapRefCallback]);

  // Detect mobile device
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const { handleMove, handleMoveEnd, onHover, onClick } = useFranceMapHandlers({
    mapRef,
    setViewState,
    setVisibleRegionCodes,
    setVisibleDepartementCodes,
    setVisibleCommuneCodes,
    setHoverInfo,
    communityMap,
    selectedTerritoryData,
    isMobile,
  });

  // Feature flag: Keep perspective functions available but unused
  void selectedRangeOption;
  void ranges;
  // Unused visible codes params (used by parent component)
  void visibleRegionCodes;
  void visibleDepartementCodes;
  void visibleCommuneCodes;

  return (
    <div className='relative h-full w-full cursor-grab bg-white'>
      {/* Show legend button for mobile when legend is hidden */}
      {!showLegend && (
        <button
          type='button'
          onClick={() => setShowLegend(true)}
          className='absolute left-4 top-4 z-30 rounded-tl-br border border-gray-200 bg-white/95 px-3 py-2 text-sm font-medium text-primary shadow-lg lg:hidden'
        >
          Afficher légende
        </button>
      )}

      <Map
        ref={mapRef}
        mapLib={maplibregl}
        mapStyle={BASE_MAP_STYLE as StyleSpecification}
        {...viewState}
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
        maxZoom={14}
        interactiveLayerIds={['regions', 'departements', 'communes']}
        onMouseMove={onHover}
        onMouseOut={() => setHoverInfo(null)}
        onClick={onClick}
        attributionControl={false}
        dragRotate={false}
        touchPitch={false}
        maxBounds={territoryFilterCode === 'FR' ? franceMetropoleBounds : undefined}
        onLoad={() => {
          const mapInstance = mapRef.current?.getMap();
          if (mapInstance) {
            updateVisibleCodes(
              mapInstance,
              selectedTerritoryData?.filterCode || 'FR',
              setVisibleRegionCodes,
              setVisibleDepartementCodes,
              setVisibleCommuneCodes,
            );
          }
        }}
      >
        <NavigationControl position='top-right' showCompass={false} />
        {/* Water/Ocean background layer */}
        <Source
          id='waterData'
          type='vector'
          url={`https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_API_KEY}`}
        >
          <Layer
            id='water'
            source='waterData'
            source-layer='water'
            type='fill'
            minzoom={0}
            maxzoom={14}
            paint={{
              'fill-color': '#dbeafe',
            }}
          />
        </Source>
        {/* Legend - always show on desktop, conditional on mobile */}
        {(showLegend || !isMobile) && (
          <ChoroplethLegend
            onClose={() => setShowLegend(false)}
            selectedScore={choroplethParameter}
            selectedYear={selectedYear}
            adminLevel={manualAdminLevel || currentAdminLevel}
          />
        )}
        <Source
          id='statesData'
          type='vector'
          url={`https://api.maptiler.com/tiles/countries/tiles.json?key=${MAPTILER_API_KEY}`}
        >
          {/* World countries background layer */}
          <Layer
            id='world-countries'
            source='statesData'
            source-layer='administrative'
            type='fill'
            minzoom={0}
            maxzoom={14}
            filter={['all', ['==', 'level', 0], ['!=', 'level_0', territoryFilterCode || 'FR']]}
            paint={{
              'fill-color': '#e5e7eb',
              'fill-opacity': 0.2,
            }}
          />
          <ChoroplethLayer
            id='regions'
            source='statesData'
            sourceLayer='administrative'
            minzoom={regionsMinZoom}
            maxzoom={regionsMaxZoom}
            filter={['all', ['==', 'level', 1], ['==', 'level_0', territoryFilterCode || 'FR']]}
            choroplethParameter={choroplethParameter}
          />
          <ChoroplethLayer
            id='departements'
            source='statesData'
            sourceLayer='administrative'
            minzoom={departementsMinZoom}
            maxzoom={departementsMaxZoom}
            filter={['all', ['==', 'level', 2], ['==', 'level_0', territoryFilterCode || 'FR']]}
            choroplethParameter={choroplethParameter}
          />
          <ChoroplethLayer
            id='communes'
            source='statesData'
            sourceLayer='administrative'
            minzoom={communesMinZoom}
            maxzoom={communesMaxZoom}
            filter={['all', ['==', 'level', 3], ['==', 'level_0', territoryFilterCode || 'FR']]}
            choroplethParameter={choroplethParameter}
          />
          <ChoroplethLayer
            id='region-borders'
            source='statesData'
            sourceLayer='administrative'
            type='line'
            minzoom={regionBordersMinZoom}
            maxzoom={regionBordersMaxZoom}
            filter={['all', ['==', 'level', 1], ['==', 'level_0', territoryFilterCode || 'FR']]}
            choroplethParameter={choroplethParameter}
          />
          <ChoroplethLayer
            id='department-borders'
            source='statesData'
            sourceLayer='administrative'
            type='line'
            minzoom={departmentBordersMinZoom}
            maxzoom={departmentBordersMaxZoom}
            filter={['all', ['==', 'level', 2], ['==', 'level_0', territoryFilterCode || 'FR']]}
            choroplethParameter={choroplethParameter}
          />
        </Source>
        {/* Place labels source */}
        <Source
          id='placesData'
          type='vector'
          url={`https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_API_KEY}`}
        >
          {/* Major cities - visible from zoom 5 */}
          <Layer
            id='place-city'
            source='placesData'
            source-layer='place'
            type='symbol'
            minzoom={5}
            maxzoom={22}
            filter={['==', 'class', 'city']}
            layout={{
              'text-field': ['coalesce', ['get', 'name:fr'], ['get', 'name']],
              'text-font': ['Noto Sans Bold'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 5, 14, 10, 18],
              'text-anchor': 'center',
              'text-offset': [0, 0.5],
            }}
            paint={{
              'text-color': '#303F8D',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1.5,
            }}
          />
          {/* Towns - visible from zoom 8 */}
          <Layer
            id='place-town'
            source='placesData'
            source-layer='place'
            type='symbol'
            minzoom={8}
            maxzoom={22}
            filter={['==', 'class', 'town']}
            layout={{
              'text-field': ['coalesce', ['get', 'name:fr'], ['get', 'name']],
              'text-font': ['Noto Sans Bold'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 8, 12, 12, 16],
              'text-anchor': 'center',
              'text-offset': [0, 0.5],
            }}
            paint={{
              'text-color': '#303F8D',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1.5,
            }}
          />
          {/* Villages - visible from zoom 11 */}
          <Layer
            id='place-village'
            source='placesData'
            source-layer='place'
            type='symbol'
            minzoom={11}
            maxzoom={22}
            filter={['==', 'class', 'village']}
            layout={{
              'text-field': ['coalesce', ['get', 'name:fr'], ['get', 'name']],
              'text-font': ['Noto Sans Bold'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 11, 11, 14, 14],
              'text-anchor': 'center',
              'text-offset': [0, 0.5],
            }}
            paint={{
              'text-color': '#303F8D',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1.5,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
