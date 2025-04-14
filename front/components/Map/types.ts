import { Community } from "@/app/models/community"



export type CommunityMaps = {
    regionsByCode: Record<string, Community>
    departmentsByCode: Record<string, Community>
    communesByCode: Record<string, Community>
  }


export type AdminType = 'region' | 'departement' | 'commune';


export type HoverInfo = {
    x: number;
    y: number;
    feature: any;
    type: AdminType;
  } | null;