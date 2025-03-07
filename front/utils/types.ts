import { GeometryObject, Topology } from 'topojson-specification';

export enum CommunityType {
  Commune = 'COM',
  Departement = 'DEP',
  Region = 'REG',
}

export type Community = {
  siren: string;
  nom: string;
  type: string;
  population: number;
  longitude: number;
  latitude: number;
};

export type CommunityGeoJSONProperties = {
  codgeo: string;
  dep: string;
  reg: string;
  libgeo: string;
  type: CommunityType;
};

export type CommunityTopoJSON = Topology<{
  communes: GeometryObject<CommunityGeoJSONProperties>;
  departements: GeometryObject<CommunityGeoJSONProperties>;
  regions: GeometryObject<CommunityGeoJSONProperties>;
}>;
