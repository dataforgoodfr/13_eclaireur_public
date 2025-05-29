import { Community } from '@/app/models/community';

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
