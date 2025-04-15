'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  MAX_FEATURES_LOAD,
} from './constants';
import type { CommunityMaps, HoverInfo } from './types';
import createCommunityMaps from './utils/createCommunityMaps';
import enrichFeatureWithData from './utils/enrichFeatureWithData';
import extractFeaturesByLevel from './utils/extractFeaturesByLevel';
import { fetchMissingData } from './utils/fetchMissingData';
import getAdminTypeFromLayerId from './utils/getAdminTypeFromLayerId';
import getCodesToFetch from './utils/getCodesToFetch';
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
  const communityMapsRef = useRef<CommunityMaps | null>(null);
  const regionsRef = useRef<Community[]>([]);
  const departementsRef = useRef<Community[]>([]);
  const communesRef = useRef<Community[]>([]);

  const router = useRouter();
  const [fetchedRegionCodes, setFetchedRegionCodes] = useState<Set<string>>(new Set());
  const [fetchedDepartementCodes, setFetchedDepartementCodes] = useState<Set<string>>(new Set());
  const [fetchedCommuneCodes, setFetchedCommuneCodes] = useState<Set<string>>(new Set());
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

  useEffect(() => {
    if (
      regionsRef.current.length > 0 &&
      departementsRef.current.length > 0 &&
      communesRef.current.length > 0
    ) {
      communityMapsRef.current = createCommunityMaps(
        regionsRef.current,
        departementsRef.current,
        communesRef.current,
      );
    }
  }, [regionsRef.current, departementsRef.current, communesRef.current]);

  // Update viewState when selectedTerritoryData changes
  useEffect(() => {
    if (selectedTerritoryData) {
      setViewState(selectedTerritoryData.viewState);
    }
  }, [selectedTerritoryData]);

  // effect to ensure data is fetched and loaded each time we navigate back to the page.
  useEffect(() => {
    if (mapReady && mapRef.current) {
      const mapInstance = mapRef.current.getMap();

      let retryCount = 0;
      const maxRetries = 5;

      const attemptQuery = () => {
        const features = mapInstance.querySourceFeatures('statesData', {
          sourceLayer: 'administrative',
          filter: ['==', ['get', 'iso_a2'], selectedTerritoryData?.filterCode || 'FR'],
        });

        console.log(`Attempt ${retryCount + 1}: Found ${features.length} features`);

        if (features.length > 0) {
          // Features found, proceed with combining datasets
          fetchAndEnrichVisibleFeatures(mapInstance);
        } else if (retryCount < maxRetries) {
          // No features found yet, retry after a delay
          retryCount++;
          setTimeout(attemptQuery, 300);
        } else {
          console.error('Failed to find features after maximum retries');
        }
      };
      attemptQuery();
    }
  }, [mapReady, selectedTerritoryData]);

  const fetchAndEnrichVisibleFeatures = async (mapInstance: maplibregl.Map) => {
    if (!mapInstance) return;

    const features = mapInstance.querySourceFeatures('statesData', {
      sourceLayer: 'administrative',
      filter: ['==', ['get', 'iso_a2'], selectedTerritoryData?.filterCode || 'FR'],
    });

    // break the features into different Admin types
    const { regions, departments, communes } = extractFeaturesByLevel(features);

    const featuresInViewport = regions.length + departments.length + communes.length;

    if (featuresInViewport < MAX_FEATURES_LOAD) {
      const regionsCodesToFetch: string[] = [];
      const departementCodesToFetch: string[] = [];
      const communeCodesToFetch: string[] = [];

      // TODO: Refactor into funciton
      features.forEach((feature) => {
        const level = feature.properties.level;

        getCodesToFetch(
          feature,
          level,
          level === 1
            ? fetchedRegionCodes
            : level === 2
              ? fetchedDepartementCodes
              : fetchedCommuneCodes,
          level === 1 ? regionsRef : level === 2 ? departementsRef : communesRef,
          level === 1
            ? (code) => regionsCodesToFetch.push(code)
            : level === 2
              ? (code) => departementCodesToFetch.push(code)
              : (code) => communeCodesToFetch.push(code),
        );
      });

      setIsLoading(true);

      await fetchMissingData(
        regionsCodesToFetch,
        fetchRegionsByCode,
        regionsRef,
        setFetchedRegionCodes,
      );

      await fetchMissingData(
        departementCodesToFetch,
        fetchDepartementsByCode,
        departementsRef,
        setFetchedDepartementCodes,
      );

      await fetchMissingData(
        communeCodesToFetch,
        fetchCommunesByCode,
        communesRef,
        setFetchedCommuneCodes,
      );

      communityMapsRef.current = createCommunityMaps(
        regionsRef.current,
        departementsRef.current,
        communesRef.current,
      );

      features.forEach((feature) => {
        const enrichedFeature = enrichFeatureWithData(feature, communityMapsRef.current);
        mapInstance.setFeatureState(
          { source: 'statesData', sourceLayer: 'administrative', id: feature.id },
          {
            mp_score: enrichedFeature.mp_score,
            subventions_score: enrichedFeature.subventions_score,
            population: enrichedFeature.population,
          },
        );
      });

      setIsLoading(false);
    } else {
      console.log('Too many features in the viewport, skipping fetch.');
    }
  };

  const debouncedQuery = useCallback(
    debounce((mapInstance: maplibregl.Map) => {
      fetchAndEnrichVisibleFeatures(mapInstance);
    }, 300),
    [],
  );

  const handleMove = (event: any) => {
    setViewState(event.viewState);

    const mapInstance = mapRef.current?.getMap();
    if (mapInstance) debouncedQuery(mapInstance);
  };

  const onHover = (event: MapLayerMouseEvent) => {
    event.originalEvent.stopPropagation();
    const { features, point } = event;

    if (features?.length) {
      setCursor('pointer');
      const feature = features[0];
      const type = getAdminTypeFromLayerId(feature.layer.id);
      setHoverInfo({ x: point.x, y: point.y, feature, type });
    } else {
      setCursor('grab');
      setHoverInfo(null);
    }
  };

  const onClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;

    const community = getCommunityDataFromFeature(feature, communityMapsRef.current);
    if (community?.siren) {
      router.push(`/community/${community.siren}`);
    }
  };

  const renderTooltip = () => {
    if (!hoverInfo) return null;

    const { feature, type, x, y } = hoverInfo;
    const data = getCommunityDataFromFeature(feature, communityMapsRef.current);

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
