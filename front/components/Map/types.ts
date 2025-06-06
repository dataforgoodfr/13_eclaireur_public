
// TODO: Replace all `any` types with proper interfaces/types for better type safety.
/* eslint-disable @typescript-eslint/no-explicit-any */

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
