// TODO: Replace all `any` types with proper interfaces/types for better type safety.
import type { MapLayerMouseEvent, MapRef } from 'react-map-gl/maplibre';

import type { Community } from '#app/models/community';

import type { AdminType, HoverInfo } from '../types';
import getCommunityDataFromFeature from './getCommunityDataFromFeature';
import { updateVisibleCodes } from './updateVisibleCodes';

interface UseFranceMapHandlersProps {
  mapRef: React.RefObject<MapRef | null>;
  setUrlState: (state: Partial<{ lat: number; lng: number; zoom: number }>) => void;
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
  setUrlState,
  setVisibleRegionCodes,
  setVisibleDepartementCodes,
  setVisibleCommuneCodes,
  setHoverInfo,
  communityMap,
  selectedTerritoryData,
  isMobile = false,
}: UseFranceMapHandlersProps) {
  // Handles map move end (after pan/zoom)
  const handleMoveEnd = () => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;

    // Get current map position
    const center = mapInstance.getCenter();
    const zoom = mapInstance.getZoom();

    // Sync to URL
    setUrlState({
      lat: Math.round(center.lat * 10000) / 10000,
      lng: Math.round(center.lng * 10000) / 10000,
      zoom: Math.round(zoom),
    });

    // Update visible codes
    updateVisibleCodes(
      mapInstance,
      selectedTerritoryData?.filterCode || 'FR',
      setVisibleRegionCodes,
      setVisibleDepartementCodes,
      setVisibleCommuneCodes,
    );
  };

  // Handles hover on map features (desktop only)
  const onHover = (event: MapLayerMouseEvent) => {
    if (isMobile) return; // Disable hover on mobile
    event.originalEvent.stopPropagation();
    const { features, point } = event;
    const feature = features?.[0];
    if (feature) {
      setHoverInfo({
        x: point.x,
        y: point.y,
        feature,
        type: feature.layer.id as AdminType,
      });
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
      setHoverInfo({
        x: point.x,
        y: point.y,
        feature,
        type: feature.layer.id as AdminType,
      });
    } else {
      // On desktop, navigate to community page
      const community = getCommunityDataFromFeature(feature, communityMap);
      if (community?.siren) {
        window.open(`/community/${community.siren}`, '_blank');
      }
    }
  };

  return {
    handleMoveEnd,
    onHover,
    onClick,
  };
}
