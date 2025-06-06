// TODO: Replace all `any` types with proper interfaces/types for better type safety.
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { MapLayerMouseEvent, MapRef } from 'react-map-gl/maplibre';

import type { Community } from '@/app/models/community';

import type { AdminType, HoverInfo } from '../types';
import getCommunityDataFromFeature from './getCommunityDataFromFeature';
import updateFeatureStates from './updateFeatureState';
import { updateVisibleCodes } from './updateVisibleCodes';

interface UseFranceMapHandlersProps {
  mapRef: React.RefObject<MapRef | null>;
  setViewState: (vs: any) => void;
  setVisibleRegionCodes: (codes: string[]) => void;
  setVisibleDepartementCodes: (codes: string[]) => void;
  setVisibleCommuneCodes: (codes: string[]) => void;
  setHoverInfo: (info: HoverInfo | null) => void;
  communityMap: Record<string, Community>;
  choroplethParameter: string;
  territoryFilterCode: string;
  selectedTerritoryData?: { filterCode?: string };
}

export function useFranceMapHandlers({
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
}: UseFranceMapHandlersProps) {
  // Handles map move (panning/zooming)
  const handleMove = (event: any) => {
    setViewState(event.viewState);
  };

  // Handles map move end (after pan/zoom)
  const handleMoveEnd = () => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;
    updateVisibleCodes(
      mapInstance,
      selectedTerritoryData?.filterCode || 'FR',
      setVisibleRegionCodes,
      setVisibleDepartementCodes,
      setVisibleCommuneCodes,
    );
    updateFeatureStates(mapInstance, communityMap, choroplethParameter, territoryFilterCode);
  };

  // Handles hover on map features
  const onHover = (event: MapLayerMouseEvent) => {
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
    if (!feature) return;
    const community = getCommunityDataFromFeature(feature, communityMap);
    if (community?.siren) {
      window.open(`/community/${community.siren}`, '_blank');
    }
  };

  return {
    handleMove,
    handleMoveEnd,
    onHover,
    onClick,
  };
}
