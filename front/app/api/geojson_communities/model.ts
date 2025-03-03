import { CommunityType } from '@/utils/types';
import { GeometryObject, Topology } from 'topojson-specification';

export type CommunityGeoJSONModel = {
  codgeo: string;
  dep: string;
  reg: string;
  libgeo: string;
  type: CommunityType;
  geometry: string;
};

export type CommunityTopoJSONModel = Topology<{
  communes: GeometryObject<Omit<CommunityGeoJSONModel, 'geometry'>>;
  departements: GeometryObject<Omit<CommunityGeoJSONModel, 'geometry'>>;
  regions: GeometryObject<Omit<CommunityGeoJSONModel, 'geometry'>>;
}>;
