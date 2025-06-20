// TODO: Replace all `any` types with proper interfaces/types for better type safety.
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ViewState } from 'react-map-gl/maplibre';

export type AdminType = 'region' | 'departement' | 'commune';

export type HoverInfo = {
  x: number;
  y: number;
  feature: any;
  type: AdminType;
} | null;

export enum TerritoryLevel {
  Region = 1,
  Department = 2,
  Commune = 3,
}

export type CollectiviteMinMax = {
  type: AdminType; // assuming these are the only values
  min_population: number;
  max_population: number;
};

// Define the territory data type
export type TerritoryData = {
  name: string;
  viewState: Partial<ViewState>;
  regionsMaxZoom: number;
  departementsMaxZoom: number;
  communesMaxZoom: number;
  filterCode: string;
};

export type ChoroplethDataSource = {
  name: string;
  dataName: string;
};

export type MapPoint = {
  code_insee: string;
  nom: string;
  population: number;
  latitude: number | null;
  longitude: number | null;
};

export type MapPointFeature = {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: string;
    name: string;
    population: number;
  };
};

export type MapPointFeatureCollection = {
  type: 'FeatureCollection';
  features: MapPointFeature[];
};
