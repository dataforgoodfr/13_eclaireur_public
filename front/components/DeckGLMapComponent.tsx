'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import type { GeoJSONData, GeoJSONFeature } from '@/utils/hooks/useGeoData';
import { GeoJsonLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { ViewStateChangeParameters } from '@deck.gl/core';

interface DeckGLMapProps {
  regionsData: GeoJSONData | null;
  departmentsData: GeoJSONData | null;
  communesData: GeoJSONData | null;
}

// Define zoom thresholds for different layers
const ZOOM_THRESHOLDS = {
  REGIONS_MIN: 0, // Always show regions when zoomed all the way out
  REGIONS_MAX: 6.5, // Hide regions when zoomed past this level
  DEPS_MIN: 5.5, // Start showing departments at this zoom level
  DEPS_MAX: 9.5, // Hide departments when zoomed past this level
  COMMUNES_MIN: 8, // Start showing communes at this zoom level
};

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

interface PickInfo {
  object?: GeoJSONFeature;
  x?: number;
  y?: number;
  coordinate?: number[];
  layer?: any;
  index?: number;
  picked?: boolean;
  lngLat?: number[];
  devicePixel?: number[];
  pixelRatio?: number;
}

export default function DeckGLMapComponent({
  regionsData,
  departmentsData,
  communesData,
}: DeckGLMapProps) {
  const router = useRouter();
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 46.603354, // Center of France
    longitude: 1.888334,
    zoom: 5,
    pitch: 0,
    bearing: 0,
  });

  const [currentZoom, setCurrentZoom] = useState(5);
  const [layers, setLayers] = useState<any[]>([]);
  const [hoveredFeature, setHoveredFeature] = useState<GeoJSONFeature | null>(null);

const onViewStateChange = useCallback((params: ViewStateChangeParameters<any>) => {
  const { viewState } = params;
  setCurrentZoom(viewState.zoom);
}, []);

  // Handle click on a feature
  const onClick = useCallback(
    (info: PickInfo) => {
      if (info.object && info.object.properties && info.object.properties.siren) {
        router.push(`/community/${info.object.properties.siren}`);
      }
    },
    [router],
  );

  // Handle hover on a feature
  const onHover = useCallback((info: PickInfo) => {
    setHoveredFeature(info.object || null);
  }, []);

  // Function to create layers based on current zoom level
  const createLayers = useCallback(() => {
    const newLayers = [];

    // Region layer - visible when zoomed out
    if (
      regionsData?.features?.length &&
      currentZoom >= ZOOM_THRESHOLDS.REGIONS_MIN &&
      currentZoom <= ZOOM_THRESHOLDS.REGIONS_MAX
    ) {
      // Calculate opacity based on zoom level for smooth transition
      const opacity =
        currentZoom > ZOOM_THRESHOLDS.DEPS_MIN
          ? Math.max(
              0,
              (ZOOM_THRESHOLDS.REGIONS_MAX - currentZoom) /
                (ZOOM_THRESHOLDS.REGIONS_MAX - ZOOM_THRESHOLDS.DEPS_MIN),
            )
          : 1;

      console.log(
        `Creating regions layer with ${regionsData.features.length} features, opacity: ${opacity}`,
      );

      newLayers.push(
        new GeoJsonLayer({
          id: 'regions-layer',
          data: regionsData,
          filled: true,
          getFillColor: [100, 120, 180, 80 * opacity], // Fade out as we zoom in
          stroked: true,
          getLineColor: [60, 80, 140, 200 * opacity],
          lineWidthMinPixels: 2,
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 200, 0, 128],
          onClick,
          onHover,
          updateTriggers: {
            getFillColor: [currentZoom, regionsData],
            getLineColor: [currentZoom, regionsData],
          },
          // Add cursor style for clickable features
          getCursor: ({ isHovering, isDragging }: { isHovering: boolean; isDragging: boolean }) =>
            isHovering ? 'pointer' : isDragging ? 'grabbing' : 'grab',
        }),
      );
    }

    // Department layer - visible at medium zoom
    if (
      departmentsData?.features?.length &&
      currentZoom >= ZOOM_THRESHOLDS.DEPS_MIN &&
      currentZoom <= ZOOM_THRESHOLDS.DEPS_MAX
    ) {
      // Calculate opacity based on zoom level for smooth transition in and out
      let opacity = 1;

      // Fade in when crossing the min threshold
      if (currentZoom < ZOOM_THRESHOLDS.DEPS_MIN + 1) {
        opacity = Math.min(1, currentZoom - ZOOM_THRESHOLDS.DEPS_MIN);
      }

      // Fade out when approaching the max threshold
      if (currentZoom > ZOOM_THRESHOLDS.DEPS_MAX - 1) {
        opacity = Math.max(0, ZOOM_THRESHOLDS.DEPS_MAX - currentZoom);
      }

      console.log(
        `Creating departments layer with ${departmentsData.features.length} features, opacity: ${opacity}`,
      );

      newLayers.push(
        new GeoJsonLayer({
          id: 'departments-layer',
          data: departmentsData,
          filled: true,
          getFillColor: [180, 100, 100, 80 * opacity],
          stroked: true,
          getLineColor: [140, 60, 60, 200 * opacity],
          lineWidthMinPixels: 1,
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 200, 0, 128],
          onClick,
          onHover,
          updateTriggers: {
            getFillColor: [currentZoom, departmentsData],
            getLineColor: [currentZoom, departmentsData],
          },
          // Add cursor style for clickable features
          getCursor: ({ isHovering, isDragging }: { isHovering: boolean; isDragging: boolean }) =>
            isHovering ? 'pointer' : isDragging ? 'grabbing' : 'grab',
        }),
      );
    }

    // Commune layer - only add if communesData is provided and zoomed in enough
    if (communesData?.features?.length && currentZoom >= ZOOM_THRESHOLDS.COMMUNES_MIN) {
      // Calculate opacity for smooth fade in
      const opacity = Math.min(1, currentZoom - ZOOM_THRESHOLDS.COMMUNES_MIN);

      console.log(
        `Creating communes layer with ${communesData.features.length} features, opacity: ${opacity}`,
      );

      newLayers.push(
        new GeoJsonLayer({
          id: 'communes-layer',
          data: communesData,
          filled: true,
          getFillColor: [100, 180, 100, 50 * opacity],
          stroked: true,
          getLineColor: [60, 140, 60, 150 * opacity],
          lineWidthMinPixels: 0.5,
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 200, 0, 128],
          onClick,
          onHover,
          updateTriggers: {
            getFillColor: [currentZoom, communesData],
            getLineColor: [currentZoom, communesData],
          },
          // Add cursor style for clickable features
          getCursor: ({ isHovering, isDragging }: { isHovering: boolean; isDragging: boolean }) =>
            isHovering ? 'pointer' : isDragging ? 'grabbing' : 'grab',
        }),
      );
    }

    return newLayers;
  }, [regionsData, departmentsData, communesData, currentZoom, onClick, onHover]);

  // Update layers when data or zoom changes
  useEffect(() => {
    const newLayers = createLayers();
    console.log(`Setting ${newLayers.length} layers at zoom level ${currentZoom}`);
    setLayers(newLayers);
  }, [createLayers, currentZoom]);

  // Function to get tooltip content
  const getTooltip = useCallback((info: PickInfo) => {
    if (!info.object) return null;

    const { properties } = info.object;
    if (!properties) return null;

    const name = properties.name || properties.libgeo || 'Unknown';
    const type = properties.type || 'Unknown type';
    const code = properties.code || '';
    const siren = properties.siren || 'N/A';
    const population = properties.population
      ? Number(properties.population).toLocaleString()
      : 'N/A';

    return {
      html: `
        <div style="padding: 8px; background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          <div style="font-weight: bold;">${name}</div>
          <div>${type} ${code}</div>
          <div style="margin-top: 4px;">SIREN: ${siren}</div>
          <div>Population: ${population}</div>
          ${siren !== 'N/A' ? '<div style="font-size: 11px; margin-top: 4px; color: #666;">Click to view details</div>' : ''}
        </div>
      `,
    };
  }, []);

  return (
    <div className='relative h-full'>
      <DeckGL
        initialViewState={viewport}
        controller={true}
        layers={layers}
        getTooltip={getTooltip}
        onViewStateChange={onViewStateChange}
      >
        {/* If you're using a base map, you'd include it here */}
      </DeckGL>

      {/* Zoom level indicator */}
      <div className='absolute bottom-2 right-2 rounded bg-white/80 px-2 py-1 text-xs'>
        Zoom: {currentZoom.toFixed(1)}
      </div>
    </div>
  );
}
