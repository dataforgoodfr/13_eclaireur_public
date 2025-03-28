'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type AdminType = 'region' | 'departement' | 'commune';

const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILES_API_KEY;

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

  // Merge useCommunities data with fetched admin data
  useEffect(() => {
    if (regionsData) regionsRef.current = regionsData;
    if (departementsData) departementsRef.current = departementsData;
  }, [regionsData, departementsData]);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/adminData'); // Fetch additional data
      const data = await res.json();

      // Ensure previous data isn't overwritten
      regionsRef.current = [...(regionsRef.current || []), ...(data.regions || [])];
      departementsRef.current = [...(departementsRef.current || []), ...(data.departements || [])];
      communesRef.current = [...(communesRef.current || []), ...(data.communes || [])];
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Create a minimalist style similar to the original - use useMemo to prevent recreating on every render
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

  // Handle hover events more carefully
  const onHover = (event: MapLayerMouseEvent) => {
    event.originalEvent.stopPropagation();

    const { features, point } = event;

    if (!features || features.length === 0) {
      setHoverInfo(null);
      return;
    }

    const feature = features[0];
    let type: AdminType = 'region';

    if (feature.layer.id === 'regions') {
      type = 'region';
    } else if (feature.layer.id === 'departements') {
      type = 'departement';
    } else if (feature.layer.id === 'communes') {
      type = 'commune';
    }

    setHoverInfo({
      x: point.x,
      y: point.y,
      feature,
      type,
    });
  };

  const onMouseLeave = () => {
    setHoverInfo(null);
  };

  const onClick = (event: MapLayerMouseEvent) => {
    const { features } = event;

    if (!features || features.length === 0) return;

    const feature = features[0];
    let type: AdminType = 'region';

    if (feature.layer.id === 'regions') {
      type = 'region';
    } else if (feature.layer.id === 'departements') {
      type = 'departement';
    } else if (feature.layer.id === 'communes') {
      type = 'commune';
    }

    const code =
      feature.properties?.code?.toString() ||
      feature.properties?.insee ||
      feature.properties?.code_commune;
    let community;

    if (type === 'commune') {
      community = communesRef.current.find((c) => c.code === code);
    } else if (type === 'departement') {
      community = departementsRef.current.find(
        (d) => d.code === code || d.nom === feature.properties?.name,
      );
    } else {
      community = regionsRef.current.find(
        (r) => r.code === code || r.nom === feature.properties?.name,
      );
    }

    if (community?.siren) {
      router.push(`/community/${community.siren}`);
    }
  };

  const renderTooltip = () => {
    if (!hoverInfo) return null;

    const { feature, type, x, y } = hoverInfo;
    const props = feature.properties;
    const code = props.code?.toString() || props.insee || props.code_commune;
    let data;

    if (type === 'commune') {
      data = communesRef.current.find((c) => c.code === code);
    } else if (type === 'departement') {
      data = departementsRef.current.find((d) => d.code === code || d.nom === props.name);
    } else {
      data = regionsRef.current.find((r) => r.code === code || r.nom === props.name);
    }

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
        onMove={(evt) => setViewState(evt.viewState)}
        maxZoom={14}
        interactiveLayerIds={['regions', 'departements', 'communes']}
        onMouseMove={onHover}
        onMouseOut={onMouseLeave}
        onClick={onClick}
        onZoom={(e) => console.log('Current zoom level:', e.viewState.zoom)}
        attributionControl={false}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          console.error('Map error:', e);
          setIsLoading(false);
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
              'fill-color': 'green',
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
              'fill-color': 'red',
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
            filter={['all', ['==', 'level', 3], ['==', 'level_0', 'FR']]}
            paint={{
              'fill-color': 'blue',
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
