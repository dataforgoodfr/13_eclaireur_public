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

import type { Community } from '@/app/models/community';
import { useCommunities } from '@/utils/hooks/useCommunities';
import { debounce } from 'lodash';
import { Loader2 } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type AdminType = 'region' | 'departement' | 'commune';

const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILES_API_KEY;

// Replace the fetchCommunesByCode function with this POST-based version
const fetchCommunesByCode = async (communeCodes: string[]) => {
  try {
    if (!communeCodes.length) return [];

    // Use POST request with codes in the request body
    const res = await fetch('/api/map_communes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codes: communeCodes }),
    });

    const data = await res.json();
    console.log('Fetched communes data:', data.communes);
    return data.communes || [];
  } catch (err) {
    console.error('Failed to fetch communes data', err);
    return [];
  }
};

const mergeFeatureData = (
  feature: any,
  regions: Community[],
  departements: Community[],
  communes: Community[],
) => {
  let featureId: string | number;
  let mergedData = {};

  if (feature.properties.level === 1) {
    featureId = feature.properties.name;
    const regionData = regions.find((r) => r.nom === featureId);
    if (regionData) mergedData = { ...feature.properties, ...regionData };
  } else if (feature.properties.level === 2) {
    featureId = feature.properties.code;
    const departementData = departements.find((d) => d.cog === featureId);
    if (departementData) mergedData = { ...feature.properties, ...departementData };
  } else if (feature.properties.level === 3) {
    featureId = feature.properties.code;
    const communeData = communes.find((c) => c.code === featureId);
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
  // Track which commune codes we've already fetched
  const [fetchedCommuneCodes, setFetchedCommuneCodes] = useState<Set<string>>(new Set());
  const [mapReady, setMapReady] = useState(false);

  // Track if we've already processed regions and departments
  const [regionsProcessed, setRegionsProcessed] = useState(false);
  const [departementsProcessed, setDepartementsProcessed] = useState(false);

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
  const [isLoading, setIsLoading] = useState(true);

  const { data: regionsData, isLoading: isLoadingRegions } = useCommunities({
    filters: { type: 'REG', limit: 100 },
  });
  const { data: departementsData, isLoading: isLoadingDepartments } = useCommunities({
    filters: { type: 'DEP', limit: 500 },
  });

  // UseMemo to persist the data
  const memoizedRegions = useMemo(() => regionsData || [], [regionsData]);
  const memoizedDepartements = useMemo(() => departementsData || [], [departementsData]);

  // Manage loading state directly based on data loading states

  useEffect(() => {
    if (isLoadingRegions || isLoadingDepartments) {
      setIsLoading(true);
    } else {
      setIsLoading(false); // Only set to false when both regions and departments are loaded
    }
  }, [isLoadingRegions, isLoadingDepartments]); // Trigger when either loading state changes

  useEffect(() => {
    // Update refs only if the memoized data has changed
    if (memoizedRegions.length > 0) regionsRef.current = memoizedRegions;
    if (memoizedDepartements.length > 0) departementsRef.current = memoizedDepartements;
  }, [memoizedRegions, memoizedDepartements]);

  useEffect(() => {
    // Update refs only if the memoized data has changed
    if (memoizedRegions.length > 0) regionsRef.current = memoizedRegions;
    if (memoizedDepartements.length > 0) departementsRef.current = memoizedDepartements;
  }, [memoizedRegions, memoizedDepartements]);

  // Process regions and departments when the map is ready and data is loaded
  useEffect(() => {
    if (!mapReady || isLoadingRegions || isLoadingDepartments) return;

    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;

    // Process regions if not already processed
    if (!regionsProcessed && regionsRef.current.length > 0) {
      processRegions(mapInstance);
    }

    // Process departments if not already processed
    if (!departementsProcessed && departementsRef.current.length > 0) {
      processDepartments(mapInstance);
    }
  }, [mapReady, isLoadingRegions, isLoadingDepartments, regionsProcessed, departementsProcessed]);

  const processRegions = (mapInstance: maplibregl.Map) => {
    console.log('Processing regions...');
    const regionFeatures = mapInstance.querySourceFeatures('statesData', {
      sourceLayer: 'administrative',
      filter: ['all', ['==', 'level', 1], ['==', 'level_0', 'FR']],
    });

    if (regionFeatures.length === 0) {
      // If no features found, try again later
      setTimeout(() => processRegions(mapInstance), 500);
      return;
    }

    regionFeatures.forEach((feature) => {
      mergeFeatureData(feature, regionsRef.current, [], []);
      const population = Number.parseInt(feature.properties.population) || 0;
      mapInstance.setFeatureState(
        { source: 'statesData', sourceLayer: 'administrative', id: feature.id },
        { population },
      );
    });

    setRegionsProcessed(true);
    console.log('Regions processed successfully');
  };

  const processDepartments = (mapInstance: maplibregl.Map) => {
    console.log('Processing departments...');
    const departmentFeatures = mapInstance.querySourceFeatures('statesData', {
      sourceLayer: 'administrative',
      filter: ['all', ['==', 'level', 2], ['==', 'level_0', 'FR']],
    });
    if (departmentFeatures.length === 0) {
      // If no features found, try again later
      setTimeout(() => processDepartments(mapInstance), 500);
      return;
    }
    departmentFeatures.forEach((feature) => {
      mergeFeatureData(feature, [], departementsRef.current, []);
      const population = Number.parseInt(feature.properties.population) || 0;
      mapInstance.setFeatureState(
        { source: 'statesData', sourceLayer: 'administrative', id: feature.id },
        { population },
      );
    });

    setDepartementsProcessed(true);
    console.log('Departments processed successfully');
  };

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

  // This function now handles all data merging and fetching communes on demand
  const combineDatasets = async (mapInstance: maplibregl.Map) => {
    if (!mapInstance) return;

    const features = mapInstance.querySourceFeatures('statesData', {
      sourceLayer: 'administrative',
      filter: ['==', 'iso_a2', 'FR'],
    });

    const communesInViewport = features.length;

    // Log the number of communes in viewport for debugging (optional)
    console.log(`Found ${communesInViewport} features in viewport`);

    // Only fetch communes if there are less than 5000 in the viewport
    if (communesInViewport < 5000) {
      // Collect commune codes that need to be fetched
      const communeCodesToFetch: string[] = [];

      features.forEach((feature) => {
        // For regions and departments, use the existing data
        if (feature.properties.level === 1 || feature.properties.level === 2) {
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
        // For communes, collect codes to fetch
        else if (feature.properties.level === 3) {
          const featureId = feature.properties.code;
          // Check if we already have this commune in our cache or if we've already fetched it
          const existingCommune = communesRef.current.find((c) => c.code === featureId);
          if (!existingCommune && featureId && !fetchedCommuneCodes.has(featureId)) {
            communeCodesToFetch.push(featureId);
          }
        }
      });

      console.log(`Need to fetch ${communeCodesToFetch.length} new communes`);

      if (communeCodesToFetch.length > 0) {
        setIsLoading(true);
        const newCommunes = await fetchCommunesByCode(communeCodesToFetch);
        console.log(`Received ${newCommunes.length} communes from API`);

        // Add the new communes to our cache
        if (newCommunes.length > 0) {
          const processedCommunes = newCommunes.map((commune: Community) => ({
            ...commune,
            code: commune.cog.toString(),
          }));

          communesRef.current = [...communesRef.current, ...processedCommunes];

          // Update our set of fetched codes
          setFetchedCommuneCodes((prev) => {
            const newSet = new Set(prev);
            communeCodesToFetch.forEach((code) => newSet.add(code));
            return newSet;
          });
        } else {
          setFetchedCommuneCodes((prev) => {
            const newSet = new Set(prev);
            communeCodesToFetch.forEach((code) => newSet.add(code));
            return newSet;
          });
        }

        // Now process all features again with the updated commune data
        features.forEach((feature) => {
          if (feature.properties.level === 3) {
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
      }
    } else {
      console.log('Too many communes in the viewport, skipping fetch.');
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
    let type: AdminType = 'region';
    if (feature.layer.id === 'regions') type = 'region';
    else if (feature.layer.id === 'departements') type = 'departement';
    else if (feature.layer.id === 'communes') type = 'commune';

    const code =
      feature.properties?.code?.toString() ||
      feature.properties?.insee ||
      feature.properties?.code_commune;
    let community;

    if (type === 'commune') community = communesRef.current.find((c) => c.code === code);
    else if (type === 'departement')
      community = departementsRef.current.find(
        (d) => d.code === code || d.nom === feature.properties?.name,
      );
    else
      community = regionsRef.current.find(
        (r) => r.code === code || r.nom === feature.properties?.name,
      );

    if (community?.siren) router.push(`/community/${community.siren}`);
  };

  const renderTooltip = () => {
    if (!hoverInfo) return null;

    const { feature, type, x, y } = hoverInfo;
    console.log(feature);
    const props = feature.properties;
    const code = props.code?.toString();
    let data;
    if (type === 'commune') data = communesRef.current.find((c) => c.code === code);
    else if (type === 'departement')
      data = departementsRef.current.find((d) => d.cog === code || d.nom === props.name);
    // check code bah rhin is alsace
    // haut rhin is alsace
    // corsica is not working
    else data = regionsRef.current.find((r) => r.code === code || r.nom === props.name);

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
        <div className='text-xs text-gray-400'>Code: {data.code}</div>
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
        onLoad={() => {
          setMapReady(true);

          // Reset processed flags when navigating back to the page
          setRegionsProcessed(false);
          setDepartementsProcessed(false);
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
