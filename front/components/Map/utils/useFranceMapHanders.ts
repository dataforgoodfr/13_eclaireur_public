// TODO: Replace all `any` types with proper interfaces/types for better type safety.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';
import type { MapLayerMouseEvent, MapRef } from 'react-map-gl/maplibre';

import type { Community } from '#app/models/community';

import type { AdminType, HoverInfo } from '../types';
import getCommunityDataFromFeature from './getCommunityDataFromFeature';
import { updateVisibleCodes } from './updateVisibleCodes';

interface UseFranceMapHandlersProps {
  mapRef: React.RefObject<MapRef | null>;
  setViewState: (vs: any) => void;
  setVisibleRegionCodes: (codes: string[]) => void;
  setVisibleDepartementCodes: (codes: string[]) => void;
  setVisibleCommuneCodes: (codes: string[]) => void;
  setHoverInfo: (info: HoverInfo | null) => void;
  communityMap: Record<string, Community>;
  selectedTerritoryData?: { filterCode?: string };
  isMobile?: boolean;
}

export function useFranceMapHandlers({
  mapRef,
  setViewState,
  setVisibleRegionCodes,
  setVisibleDepartementCodes,
  setVisibleCommuneCodes,
  setHoverInfo,
  communityMap,
  selectedTerritoryData,
  isMobile = false,
}: UseFranceMapHandlersProps) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handles map move (panning/zooming)
  const handleMove = (event: any) => {
    setViewState(event.viewState);
  };

  // Handles map move end (after pan/zoom) with debouncing
  const handleMoveEnd = () => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounced timer
    debounceTimerRef.current = setTimeout(() => {
      const mapInstance = mapRef.current?.getMap();
      if (!mapInstance) return;
      updateVisibleCodes(
        mapInstance,
        selectedTerritoryData?.filterCode || 'FR',
        setVisibleRegionCodes,
        setVisibleDepartementCodes,
        setVisibleCommuneCodes,
      );
      // Note: updateFeatureStates is now handled by useEffect in FranceMap.tsx
      // This prevents premature updates before data is fetched
    }, 150); // 150ms debounce delay
  };

  // Handles hover on map features (desktop only)
  const onHover = (event: MapLayerMouseEvent) => {
    if (isMobile) return; // Disable hover on mobile
    event.originalEvent.stopPropagation();
    const { features, point } = event;
    const feature = features?.[0];
    if (feature) {
      setHoverInfo({ x: point.x, y: point.y, feature, type: feature.layer.id as AdminType });
    } else {
      setHoverInfo(null);
    }
  };

  // Handles click on map features
  const onClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) {
      setHoverInfo(null); // Clear tooltip on empty click
      return;
    }

    if (isMobile) {
      // On mobile, show tooltip on click instead of navigating
      const { point } = event;
      setHoverInfo({ x: point.x, y: point.y, feature, type: feature.layer.id as AdminType });
    } else {
      // On desktop, navigate to community page
      const community = getCommunityDataFromFeature(feature, communityMap);
      if (community?.siren) {
        window.open(`/community/${community.siren}`, '_blank');
      }
    }
  };

  return {
    handleMove,
    handleMoveEnd,
    onHover,
    onClick,
  };
}
