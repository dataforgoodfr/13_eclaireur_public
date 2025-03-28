'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { Layer, MapLayerMouseEvent, MapRef, Source, type ViewState } from 'react-map-gl/maplibre';

import { useRouter } from 'next/navigation';

import type { Community } from '@/app/models/community';
import { useCommunities } from '@/utils/hooks/useCommunities';
import { debounce } from 'lodash';
import { Loader2 } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type AdminType = 'region' | 'departement' | 'commune';

const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILES_API_KEY;

const fetchAndMergeCommunityData = async () => {
  try {
    const res = await fetch('/api/adminData');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch admin data', err);
    return null;
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
    if (communeData) mergedData = { ...feature.properties, ...communeData };
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

  const { data: regionsData } = useCommunities({ filters: { type: 'REG', limit: 100 } });
  const { data: departementsData } = useCommunities({ filters: { type: 'DEP', limit: 500 } });  

  useEffect(() => {
    if (regionsData) regionsRef.current = regionsData;
    if (departementsData) departementsRef.current = departementsData;
  }, [regionsData, departementsData]);

  const [adminData, setAdminData] = useState<{
    regions: Community[];
    departements: Community[];
    communes: Community[];
  } | null>(null);

  useEffect(() => {
    const loadAdminData = async () => {
      const data = await fetchAndMergeCommunityData();
      if (data) {
        setAdminData(data);
        regionsRef.current = [...(regionsRef.current || []), ...(data.regions || [])];
        departementsRef.current = [
          ...(departementsRef.current || []),
          ...(data.departements || []),
        ];
        communesRef.current = [...(communesRef.current || []), ...(data.communes || [])];
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, []);

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

  const checkTileStructure = (mapInstance: maplibregl.Map) => {
    if (!mapInstance) return;

    const features = mapInstance.querySourceFeatures('statesData', {
      sourceLayer: 'administrative',
      filter: ['==', 'iso_a2', 'FR'],
    });

    features.forEach((feature) => {
      mergeFeatureData(feature, regionsRef.current, departementsRef.current, communesRef.current);
      const population = parseInt(feature.properties.population) || 0;
      mapInstance.setFeatureState(
        { source: 'statesData', sourceLayer: 'administrative', id: feature.id },
        { population },
      );
    });
  };

  const debouncedQuery = useCallback(
    debounce((mapInstance: maplibregl.Map) => {
      checkTileStructure(mapInstance);
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
    const props = feature.properties;
    const code = props.code?.toString() || props.insee || props.code_commune;
    let data;

    if (type === 'commune') data = communesRef.current.find((c) => c.code === code);
    else if (type === 'departement')
      data = departementsRef.current.find((d) => d.code === code || d.nom === props.name);
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
        {type === 'commune' && (
          <div className='text-xs text-gray-500'>Département: {data.departement?.nom ?? 'N/A'}</div>
        )}
        {type !== 'region' && (
          <div className='text-xs text-gray-500'>Région: {data.region?.nom ?? 'N/A'}</div>
        )}
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
        onLoad={() => {
          const mapInstance = mapRef.current?.getMap();
          if (mapInstance) {
            checkTileStructure(mapInstance);
            setIsLoading(false);
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
            maxzoom={6}
            filter={['all', ['==', 'level', 1], ['==', 'level_0', 'FR']]}
            paint={{
              'fill-color': [
                'interpolate',
                ['linear'],
                ['feature-state', 'population'], // Use population from feature state
                0,
                '#f2f0f7', // Low population color
                1000000,
                '#9e9ac8',
                10000000,
                '#6a51a3', // High population color
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
                ['feature-state', 'population'], // Use population from feature state
                0,
                '#f2f0f7', // Low population color
                500,
                '#9e9ac8',
                1000,
                '#6a51a3', // High population color
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
