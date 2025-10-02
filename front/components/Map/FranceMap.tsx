'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Map, {
  Layer,
  type MapRef,
  NavigationControl,
  Source,
  type StyleSpecification,
  type ViewState,
} from 'react-map-gl/maplibre';

import type { Community } from '#app/models/community';
import { useCommunes } from '#utils/hooks/map/useCommunes';
import { useDepartements } from '#utils/hooks/map/useDepartements';
import { useRegions } from '#utils/hooks/map/useRegions';
import { Loader2 } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import ChoroplethLayer from './ChoroplethLayer';
import DotsLayer from './DotsLayer';
import ChoroplethLegend from './Legend';
import MapTooltip from './MapTooltip';
import { BASE_MAP_STYLE, MAPTILER_API_KEY } from './constants';
import type { ChoroplethDataSource, HoverInfo, TerritoryData } from './types';
import { createMapPointFeatures } from './utils/createMapPointFeatures';
import updateFeatureStates from './utils/updateFeatureState';
import { updateVisibleCodes } from './utils/updateVisibleCodes';
import { useFranceMapHandlers } from './utils/useFranceMapHanders';

interface MapProps {
  selectedTerritoryData: TerritoryData | undefined;
  selectedChoroplethData: ChoroplethDataSource;
  viewState: Partial<ViewState>;
  setViewState: (vs: Partial<ViewState>) => void;
  ranges: Record<string, [number, number]>;
  selectedRangeOption: string;
  currentAdminLevel: string;
  populationMinMax: { min: number; max: number };
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
  selectedYear: number;
  manualAdminLevel: 'regions' | 'departements' | 'communes' | null;
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
  populationMinMax,
  showLegend,
  setShowLegend,
  selectedYear,
  manualAdminLevel,
}: MapProps) {
  const mapRef = useRef<MapRef>(null);
  const [visibleRegionCodes, setVisibleRegionCodes] = useState<string[]>([]);
  const [visibleDepartementCodes, setVisibleDepartementCodes] = useState<string[]>([]);
  const [visibleCommuneCodes, setVisibleCommuneCodes] = useState<string[]>([]);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);

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
  const { data: communes, isLoading: communesLoading } = useCommunes(
    visibleCommuneCodes,
    selectedYear,
  );
  const { data: departements, isLoading: departementsLoading } = useDepartements(
    visibleDepartementCodes,
    selectedYear,
  );
  const { data: regions, isLoading: regionsLoading } = useRegions(visibleRegionCodes, selectedYear);

  const regionDots = createMapPointFeatures(regions as Community[]);
  const departementDots = createMapPointFeatures(departements as Community[]);
  const communeDots = createMapPointFeatures(communes as Community[]);

  const communityMap = useMemo(() => {
    const map: Record<string, Community> = {};
    (regions ?? []).forEach((c) => {
      const regionCode = c.code_insee_region;
      if (regionCode) map[`region-${regionCode}`] = c;
    });
    (departements ?? []).forEach((c) => {
      const deptCode = c.code_insee;
      if (deptCode) map[`departement-${deptCode}`] = c;
    });
    (communes ?? []).forEach((c) => {
      const communeCode = c.code_insee;
      if (communeCode) map[`commune-${communeCode}`] = c;
    });
    return map;
  }, [regions, departements, communes]);

  useEffect(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;

    updateFeatureStates(mapInstance, communityMap, choroplethParameter, territoryFilterCode);
  }, [communityMap, choroplethParameter, territoryFilterCode]);

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
    choroplethParameter,
    territoryFilterCode,
    selectedTerritoryData,
    isMobile,
  });
  return (
    <div className='relative h-full w-full cursor-grab bg-white'>
      {/* Show legend button for mobile when legend is hidden */}
      {!showLegend && (
        <button
          onClick={() => setShowLegend(true)}
          className='absolute left-4 top-4 z-30 rounded-tl-br border border-gray-200 bg-white/95 px-3 py-2 text-sm font-medium text-primary shadow-lg lg:hidden'
        >
          Afficher légende
        </button>
      )}

      {(communesLoading || departementsLoading || regionsLoading) && (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70'>
          <Loader2 className='h-8 w-8 animate-spin text-gray-500' />
        </div>
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
            populationMinMax={populationMinMax}
            selectedRangeOption={selectedRangeOption}
            onClose={() => setShowLegend(false)}
          />
        )}
        <MapTooltip
          hoverInfo={hoverInfo}
          communityMap={communityMap}
          isMobile={isMobile}
          onClose={() => setHoverInfo(null)}
        />
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
              'fill-opacity': 0.4,
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
        {regionDots?.features?.length > 0 && (
          <DotsLayer
            id='regions'
            data={regionDots}
            minzoom={regionsMinZoom}
            maxzoom={regionsMaxZoom}
            minPopulationForRadius={populationMinMax.min}
            maxPopulationForRadius={populationMinMax.max}
            populationRange={ranges['population']}
          />
        )}
        {departementDots?.features?.length > 0 && (
          <DotsLayer
            id='departements'
            data={departementDots}
            minzoom={departementsMinZoom}
            maxzoom={departementsMaxZoom}
            minPopulationForRadius={populationMinMax.min}
            maxPopulationForRadius={populationMinMax.max}
            populationRange={ranges['population']}
          />
        )}
        {communeDots?.features?.length > 0 && (
          <DotsLayer
            id='communes'
            data={communeDots}
            minzoom={communesMinZoom}
            maxzoom={communesMaxZoom}
            minPopulationForRadius={populationMinMax.min}
            maxPopulationForRadius={populationMinMax.max}
            populationRange={ranges['population']}
          />
        )}
      </Map>
    </div>
  );
}
