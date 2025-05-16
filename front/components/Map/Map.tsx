'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import Map, {
  Layer,
  type MapLayerMouseEvent,
  type MapRef,
  Source,
  type StyleSpecification,
  type ViewState,
} from 'react-map-gl/maplibre';

import { useRouter } from 'next/navigation';

import type { Community } from '@/app/models/community';
import {
  fetchCommunesByCode,
  fetchDepartementsByCode,
  fetchRegionsByCode,
} from '@/utils/fetchers/map/map-fetchers';
import { useCommunes } from '@/utils/hooks/map/useCommunes';
import { useDepartements } from '@/utils/hooks/map/useDepartements';
import { useRegions } from '@/utils/hooks/map/useRegions';
import { debounce } from '@/utils/utils';
import { Loader2 } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { TerritoryData } from './MapLayout';
import type { ChoroplethDataSource } from './MapLayout';
import {
  BASE_MAP_STYLE,
  DEFAULT_VIEW_STATE,
  MAPTILER_API_KEY,
} from './constants';
import type { HoverInfo } from './types';
import extractFeaturesByLevel from './utils/extractFeaturesByLevel';
import getAdminTypeFromLayerId from './utils/getAdminTypeFromLayerId';
import getCommunityDataFromFeature from './utils/getCommunityDataFromFeature';

// TODO data checking:
// Guyane does not have a department
// Martinique does not have a department
// Mayotte does not have a region

interface TerritoryMapProps {
  selectedTerritoryData: TerritoryData | undefined;
  selectedChoroplethData: ChoroplethDataSource;
}

export default function FranceMap({
  selectedTerritoryData,
  selectedChoroplethData,
}: TerritoryMapProps) {
  const mapRef = useRef<MapRef>(null);

  const router = useRouter();

  const [visibleRegionCodes, setVisibleRegionCodes] = useState<string[]>([]);
  const [visibleDepartementCodes, setVisibleDepartementCodes] = useState<string[]>([]);
  const [visibleCommuneCodes, setVisibleCommuneCodes] = useState<string[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [cursor, setCursor] = useState<string>('grab');
  const [viewState, setViewState] = useState<Partial<ViewState>>(
    selectedTerritoryData?.viewState || DEFAULT_VIEW_STATE,
  );
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
  const [isLoading, setIsLoading] = useState(false);

  const regionsMaxZoom = selectedTerritoryData?.regionsMaxZoom || 6;
  const departementsMaxZoom = selectedTerritoryData?.departementsMaxZoom || 8;
  const communesMaxZoom = selectedTerritoryData?.communesMaxZoom || 14;

  // Get the filter from the selected territory or use default
  const territoryFilterCode = selectedTerritoryData?.filterCode || 'FR';

  const choroplethParameter = selectedChoroplethData.dataName || 'subventions_score';

  const { data: communes, isLoading: communesLoading } = useCommunes(visibleCommuneCodes);
  const { data: departements, isLoading: departementsLoading } =
    useDepartements(visibleDepartementCodes);
  const { data: regions, isLoading: regionsLoading } = useRegions(visibleRegionCodes);

  const communityMap = useMemo(() => {
    const map: Record<string, Community> = {};
    (regions ?? []).forEach((c) => {
      // Use code_insee_region or code_insee for regions
      const regionCode = c.code_insee_region ?? c.code_insee ?? c.code;
      if (regionCode) map[regionCode.toString()] = c;
    });
    (departements ?? []).forEach((c) => {
      const deptCode = c.code_insee ?? c.code;
      if (deptCode) map[deptCode.toString()] = c;
    });
    (communes ?? []).forEach((c) => {
      const communeCode = c.code_insee ?? c.code;
      if (communeCode) map[communeCode.toString()] = c;
    });
    return map;
  }, [regions, departements, communes]);

  // Update viewState when selectedTerritoryData changes
  useEffect(() => {
    if (selectedTerritoryData) {
      setViewState(selectedTerritoryData.viewState);
    }
  }, [selectedTerritoryData]);

  function updateVisibleCodes(mapInstance: maplibregl.Map) {
    const features = mapInstance.querySourceFeatures('statesData', {
      sourceLayer: 'administrative',
      filter: ['==', ['get', 'iso_a2'], selectedTerritoryData?.filterCode || 'FR'],
    });

    const { regions, departments, communes } = extractFeaturesByLevel(features);

    setVisibleRegionCodes(regions.map((f) => f.id?.toString().slice(-2)).filter(Boolean));
    setVisibleDepartementCodes(departments.map((f) => f.properties.code));
    setVisibleCommuneCodes(communes.map((f) => f.properties.code));
  }

  const handleMove = (event: any) => {
    setViewState(event.viewState);

    const mapInstance = mapRef.current?.getMap();
    if (mapInstance) {
      updateVisibleCodes(mapInstance);
    }
  };

  const getActiveFeatureType = (zoom: number) => {
    if (zoom <= regionsMaxZoom) return 'region';
    if (zoom <= departementsMaxZoom) return 'departement';
    return 'commune';
  };

  const onHover = (event: MapLayerMouseEvent) => {
    event.originalEvent.stopPropagation();
    const { features, point } = event;
    const zoom = viewState.zoom ?? regionsMaxZoom; // fallback if zoom is undefined

    const activeType = getActiveFeatureType(zoom);

    // Only consider features of the active type
    const feature = features?.find((f) => getAdminTypeFromLayerId(f.layer.id) === activeType);

    if (feature) {
      setCursor('pointer');
      setHoverInfo({ x: point.x, y: point.y, feature, type: activeType });
    } else {
      setCursor('grab');
      setHoverInfo(null);
    }
  };

  const onClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;

    const community = getCommunityDataFromFeature(feature, communityMap);
    if (community?.siren) {
      router.push(`/community/${community.siren}`);
    }
  };

  const renderTooltip = () => {
    if (!hoverInfo) return null;

    const { feature, type, x, y } = hoverInfo;
    const data = getCommunityDataFromFeature(feature, communityMap);

    return (
      <div
        className='pointer-events-none absolute z-50 rounded-lg bg-white px-3 py-2 text-sm text-gray-900 shadow-md'
        style={{ left: x + 10, top: y + 10 }}
      >
        {data ? (
          <>
            <div className='font-semibold'>{data.nom}</div>
            <div className='text-xs text-gray-700'>
              Population: {data.population?.toLocaleString() ?? 'N/A'}
            </div>
            <div className='text-xs text-gray-500'>SIREN: {data.siren ?? 'N/A'}</div>
            <div className='text-xs text-gray-400'>Code: {data.code_insee}</div>
            <div className='text-xs text-gray-400'>Subventions score: {data.subventions_score}</div>
            <div className='text-xs text-gray-400'>Marches Public score: {data.mp_score}</div>
          </>
        ) : (
          <>
            <div className='text-sm text-gray-600'>Unknown {type}</div>
            <div className='text-sm text-gray-600'>{feature.properties?.name}</div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className='relative h-[800px] w-[800px] rounded-lg shadow-md'>
      {isLoading && (
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
        maxZoom={14}
        interactiveLayerIds={['regions', 'departements', 'communes']}
        onMouseMove={onHover}
        onMouseOut={() => setHoverInfo(null)}
        onClick={onClick}
        attributionControl={false}
        dragRotate={false}
        touchPitch={false}
        cursor={cursor}
        onLoad={() => {
          setMapReady(true);
          const mapInstance = mapRef.current?.getMap();
          if (mapInstance) {
            updateVisibleCodes(mapInstance);
          }
        }}
      >
        <Source
          id='statesData'
          type='vector'
          url={`https://api.maptiler.com/tiles/countries/tiles.json?key=${MAPTILER_API_KEY}`}
        >
          {/* Regions Layer */}
          <Layer
            id='regions'
            source-layer='administrative'
            type='fill'
            minzoom={0}
            maxzoom={regionsMaxZoom}
            filter={['all', ['==', 'level', 1], ['==', 'level_0', territoryFilterCode || 'FR']]}
            paint={{
              'fill-color': [
                'interpolate',
                ['linear'],
                // Use a fallback value of 0 when feature-state population is not set
                ['coalesce', ['feature-state', choroplethParameter], 5],
                1,
                '#2ca02c', // green
                2,
                '#a1d99b', // light green
                3,
                '#ffffb2', // yellow
                4,
                '#fdae6b', // orange
                5,
                '#de2d26', // red
              ],
              'fill-opacity': 0.85,
              'fill-outline-color': '#000',
            }}
          />
          {/* Departments Layer */}
          <Layer
            id='departements'
            source-layer='administrative'
            type='fill'
            minzoom={regionsMaxZoom}
            maxzoom={departementsMaxZoom}
            filter={['all', ['==', 'level', 2], ['==', 'level_0', territoryFilterCode || 'FR']]}
            paint={{
              'fill-color': [
                'interpolate',
                ['linear'],
                ['coalesce', ['feature-state', choroplethParameter], 5],
                1,
                '#2ca02c', // green
                2,
                '#a1d99b', // light green
                3,
                '#ffffb2', // yellow
                4,
                '#fdae6b', // orange
                5,
                '#de2d26', // red
              ],
              'fill-opacity': 0.85,
              'fill-outline-color': '#000',
            }}
          />

          {/* Communes Layer */}
          <Layer
            id='communes'
            source-layer='administrative'
            type='fill'
            minzoom={departementsMaxZoom}
            maxzoom={communesMaxZoom}
            filter={['==', 'level', 3]}
            paint={{
              'fill-color': [
                'interpolate',
                ['linear'],
                ['coalesce', ['feature-state', choroplethParameter], 5],
                1,
                '#2ca02c', // green
                2,
                '#a1d99b', // light green
                3,
                '#ffffb2', // yellow
                4,
                '#fdae6b', // orange
                5,
                '#de2d26', // red
              ],
              'fill-opacity': 0.85,
              'fill-outline-color': '#000',
            }}
          />

          {/* Region Borders */}
          <Layer
            id='region-borders'
            source-layer='administrative'
            type='line'
            minzoom={regionsMaxZoom}
            maxzoom={communesMaxZoom}
            filter={['all', ['==', 'level', 1], ['==', 'level_0', territoryFilterCode || 'FR']]}
            paint={{
              'line-color': 'black',
              'line-width': ['interpolate', ['linear'], ['zoom'], 6, 2, 10, 2],
              'line-opacity': 1,
            }}
          />

          {/* Department Borders */}
          <Layer
            id='department-borders'
            source-layer='administrative'
            type='line'
            minzoom={departementsMaxZoom}
            maxzoom={communesMaxZoom}
            filter={['all', ['==', 'level', 2], ['==', 'level_0', territoryFilterCode || 'FR']]}
            paint={{
              'line-color': 'black',
              'line-width': ['interpolate', ['linear'], ['zoom'], 6, 2, 10, 2],
              'line-opacity': 1,
            }}
          />
        </Source>
      </Map>
      {renderTooltip()}
    </div>
  );
}
