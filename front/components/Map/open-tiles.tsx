'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, {
  Layer,
  type MapLayerMouseEvent,
  type MapRef,
  Source,
  type ViewState,
} from 'react-map-gl/maplibre';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

import type { Community } from '@/app/models/community';
import {
  fetchCommunesByCode,
  fetchDepartementsByCode,
  fetchRegionsByCode,
} from '@/utils/fetchers/map/map-fetchers';
import { debounce } from 'lodash';
import { Loader2 } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type AdminType = 'region' | 'departement' | 'commune';

const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILES_API_KEY;

// TODO: Move to separate file
const mergeFeatureData = (
  feature: any,
  regions: Community[],
  departements: Community[],
  communes: Community[],
) => {
  let featureId: string | number;
  let mergedData = {};

  if (feature.properties.level === 1) {
    featureId = feature.id.toString().slice(-2);
    const regionData = regions.find((r) => r.code_insee_region === featureId);
    if (regionData) mergedData = { ...feature.properties, ...regionData };
  } else if (feature.properties.level === 2) {
    featureId = feature.properties.code;
    const departementData = departements.find((d) => d.code_insee === featureId);
    if (departementData) mergedData = { ...feature.properties, ...departementData };
  } else if (feature.properties.level === 3) {
    featureId = feature.properties.code;
    const communeData = communes.find((c) => c.code_insee === featureId);
    if (communeData) {
      // console.log(`Merging commune data for ${featureId}:`, communeData)
      mergedData = { ...feature.properties, ...communeData };
    } else {
      console.log(`No commune data found for code ${featureId}`);
    }
  }

  feature.properties = { ...feature.properties, ...mergedData };

  return feature;
};

const FranceMap = () => {
  const mapRef = useRef<MapRef>(null);
  const regionsRef = useRef<Community[]>([]);
  const departementsRef = useRef<Community[]>([]);
  const communesRef = useRef<Community[]>([]);
  const router = useRouter();
  const [fetchedRegionCodes, setFetchedRegionCodes] = useState<Set<string>>(new Set());
  const [fetchedDepartementCodes, setFetchedDepartementCodes] = useState<Set<string>>(new Set());
  const [fetchedCommuneCodes, setFetchedCommuneCodes] = useState<Set<string>>(new Set());

  const [mapReady, setMapReady] = useState(false);

  // effect to ensure data is fetched and loaded each time we navigate back to the page.
  useEffect(() => {
    if (mapReady && mapRef.current) {
      const mapInstance = mapRef.current.getMap();

      let retryCount = 0;
      const maxRetries = 5;

      const attemptQuery = () => {
        const features = mapInstance.querySourceFeatures('statesData', {
          sourceLayer: 'administrative',
          filter: ['==', ['get', 'iso_a2'], 'FR'],
        });

        console.log(`Attempt ${retryCount + 1}: Found ${features.length} features`);

        if (features.length > 0) {
          // Features found, proceed with combining datasets
          combineDatasets(mapInstance);
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
  }, [mapReady]);

  const [cursor, setCursor] = useState<string>('grab');

  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: 2.2137,
    latitude: 46.2276,
    zoom: 5,
  });

  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    feature: any;
    type: AdminType;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const minimalistStyle = useMemo(
    () => ({
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
    }),
    [MAPTILER_API_KEY],
  );

  const combineDatasets = async (mapInstance: maplibregl.Map) => {
    if (!mapInstance) return;

    const features = mapInstance.querySourceFeatures('statesData', {
      sourceLayer: 'administrative',
      filter: ['==', ['get', 'iso_a2'], 'FR'],
    });

    const regionsInViewport = features.filter((feature) => feature.properties.level === 1);
    const departementsInViewport = features.filter((feature) => feature.properties.level === 2);
    const communesInViewport = features.filter((feature) => feature.properties.level === 3);

    const featuresInViewport =
      regionsInViewport.length + departementsInViewport.length + communesInViewport.length;

    if (featuresInViewport < 5000) {
      const regionsCodesToFetch: string[] = [];
      const departementCodesToFetch: string[] = [];
      const communeCodesToFetch: string[] = [];

      features.forEach((feature) => {
        if (feature.properties.level === 1) {
          const featureId = feature?.id?.toString().slice(-2) || '';
          const alreadyFetched = fetchedRegionCodes.has(featureId);
          const alreadyInCache = regionsRef.current.find((r) => r.code_insee_region === featureId);
          if (!alreadyInCache && featureId && !alreadyFetched) {
            regionsCodesToFetch.push(featureId);
          }
        } else if (feature.properties.level === 2) {
          const featureId: string = feature?.properties?.code;
          const alreadyFetched = fetchedDepartementCodes.has(featureId);
          const alreadyInCache = departementsRef.current.find((d) => d.code_insee === featureId);
          if (!alreadyInCache && featureId && !alreadyFetched) {
            departementCodesToFetch.push(featureId);
          }
        } else if (feature.properties.level === 3) {
          const featureId = feature.properties.code;
          const alreadyFetched = fetchedCommuneCodes.has(featureId);
          const alreadyInCache = communesRef.current.find((c) => c.code_insee === featureId);
          if (!alreadyInCache && featureId && !alreadyFetched) {
            communeCodesToFetch.push(featureId);
          }
        }
      });

      setIsLoading(true);

      // Fetch and update Regions
      if (regionsCodesToFetch.length > 0) {
        const newRegions = await fetchRegionsByCode(regionsCodesToFetch);
        regionsRef.current = [...regionsRef.current, ...newRegions];
        setFetchedRegionCodes((prev) => {
          const newSet = new Set(prev);
          regionsCodesToFetch.forEach((code) => newSet.add(code));
          return newSet;
        });
      }

      // Fetch and update Departments
      if (departementCodesToFetch.length > 0) {
        const newDepartements = await fetchDepartementsByCode(departementCodesToFetch);
        departementsRef.current = [...departementsRef.current, ...newDepartements];
        setFetchedDepartementCodes((prev) => {
          const newSet = new Set(prev);
          departementCodesToFetch.forEach((code) => newSet.add(code));
          return newSet;
        });
      }

      // Fetch and update Communes
      if (communeCodesToFetch.length > 0) {
        const newCommunes = await fetchCommunesByCode(communeCodesToFetch);
        const processedCommunes = newCommunes.map((commune: Community) => ({
          ...commune,
          code: commune.code_insee.toString(),
        }));
        communesRef.current = [...communesRef.current, ...processedCommunes];
        setFetchedCommuneCodes((prev) => {
          const newSet = new Set(prev);
          communeCodesToFetch.forEach((code) => newSet.add(code));
          return newSet;
        });
      }

      // Enrich features with merged data
      features.forEach((feature) => {
        const level = feature.properties.level;
        if (level === 1 || level === 2 || level === 3) {
          mergeFeatureData(
            feature,
            regionsRef.current,
            departementsRef.current,
            communesRef.current,
          );

          const population = Number.parseInt(feature.properties.population) || 0;
          mapInstance.setFeatureState(
            { source: 'statesData', sourceLayer: 'administrative', id: feature.id },
            { population },
          );
        }
      });

      setIsLoading(false);
    } else {
      console.log('Too many features in the viewport, skipping fetch.');
    }
  };

  const debouncedQuery = useCallback(
    debounce((mapInstance: maplibregl.Map) => {
      combineDatasets(mapInstance);
    }, 300),
    [],
  );

  const handleMove = (event: any) => {
    setViewState(event.viewState);
    if (event.viewState.zoom >= 8) {
      const mapInstance = mapRef.current?.getMap();
      if (mapInstance) debouncedQuery(mapInstance);
    }
  };

  const onHover = (event: MapLayerMouseEvent) => {
    event.originalEvent.stopPropagation();
    const { features, point } = event;

    if (event.features && event.features.length > 0) {
      setCursor('pointer');
    } else {
      setCursor('grab');
    }

    if (!features || features.length === 0) {
      setHoverInfo(null);
      return;
    }

    const feature = features[0];
    let type: AdminType = 'region';
    if (feature.layer.id === 'regions') type = 'region';
    else if (feature.layer.id === 'departements') type = 'departement';
    else if (feature.layer.id === 'communes') type = 'commune';

    setHoverInfo({ x: point.x, y: point.y, feature, type });
  };

  const onClick = (event: MapLayerMouseEvent) => {
    const { features } = event;
    if (!features || features.length === 0) return;

    const feature = features[0];
    const props = feature.properties || {};
    const layerId = feature.layer.id;

    let type: AdminType = 'region';
    if (layerId === 'communes') type = 'commune';
    else if (layerId === 'departements') type = 'departement';

    const code = props.code?.toString();
    const regionCode = feature.id?.toString().slice(-2);
    let community;

    if (type === 'commune') {
      community = communesRef.current.find((c) => c.code_insee === code);
    } else if (type === 'departement') {
      community = departementsRef.current.find((d) => d.code_insee === code);
    } else {
      community = regionsRef.current.find((r) => r.code_insee_region === regionCode);
    }

    if (community?.siren) {
      router.push(`/community/${community.siren}`);
    }
  };

  const renderTooltip = () => {
    if (!hoverInfo) return null;

    const { feature, type, x, y } = hoverInfo;
    const props = feature.properties;
    const regionCode = feature.id.toString().slice(-2);
    const code = props.code?.toString();
    let data;
    if (type === 'commune') data = communesRef.current.find((c) => c.code_insee === code);
    else if (type === 'departement')
      data = departementsRef.current.find((d) => d.code_insee === code);
    // TODO: the tiles data for Alsace does not match the departements in the database
    // there are two Bas-Rhin (code: 68) and Haut-Rhin (67) which are now code_insee: 67A
    else data = regionsRef.current.find((r) => r.code_insee_region === regionCode);

    if (!data) {
      return (
        <div
          className='pointer-events-none absolute z-50 rounded-lg bg-white px-3 py-2 text-sm text-gray-900 shadow-md'
          style={{ left: x + 10, top: y + 10 }}
        >
          <div className='text-sm text-gray-600'>Unknown {type}</div>
        </div>
      );
    }

    return (
      <div
        className='pointer-events-none absolute z-50 rounded-lg bg-white px-3 py-2 text-sm text-gray-900 shadow-md'
        style={{ left: x + 10, top: y + 10 }}
      >
        <div className='font-semibold'>{data.nom}</div>
        <div className='text-xs text-gray-700'>
          Population: {data.population?.toLocaleString() ?? 'N/A'}
        </div>
        <div className='text-xs text-gray-500'>SIREN: {data.siren ?? 'N/A'}</div>
        <div className='text-xs text-gray-400'>Code: {data.code_insee}</div>
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
        mapLib={maplibregl as any}
        mapStyle={minimalistStyle as any}
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
            maxzoom={6}
            filter={['all', ['==', 'level', 1], ['==', 'level_0', 'FR']]}
            paint={{
              'fill-color': [
                'interpolate',
                ['linear'],
                // Use a fallback value of 0 when feature-state population is not set
                ['coalesce', ['feature-state', 'population'], 0],
                0,
                '#f2f0f7', // This ensures the default color is light
                1000000,
                '#9e9ac8',
                10000000,
                '#6a51a3',
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
            minzoom={6}
            maxzoom={8}
            filter={['all', ['==', 'level', 2], ['==', 'level_0', 'FR']]}
            paint={{
              'fill-color': [
                'interpolate',
                ['linear'],
                ['feature-state', 'population'], // Use population from feature state
                0,
                '#f2f0f7', // Low population color
                500000,
                '#9e9ac8', // Medium population color
                5000000,
                '#6a51a3', // High population color
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
            minzoom={8}
            maxzoom={14}
            filter={['==', 'level', 3]}
            paint={{
              'fill-color': [
                'interpolate',
                ['linear'],
                // Use a fallback value of 0 when feature-state population is not set
                ['coalesce', ['feature-state', 'population'], 0],
                0,
                '#f2f0f7', // This ensures the default color is light
                500,
                '#9e9ac8',
                1000,
                '#6a51a3',
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
            minzoom={6}
            maxzoom={14}
            filter={['all', ['==', 'level', 1], ['==', 'level_0', 'FR']]}
            paint={{
              'line-color': '#FF9800',
              'line-width': ['interpolate', ['linear'], ['zoom'], 6, 2, 10, 2],
              'line-opacity': 1,
            }}
          />

          {/* Department Borders */}
          <Layer
            id='department-borders'
            source-layer='administrative'
            type='line'
            minzoom={8}
            maxzoom={14}
            filter={['all', ['==', 'level', 2], ['==', 'level_0', 'FR']]}
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
};

export default FranceMap;
