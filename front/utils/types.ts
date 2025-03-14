import { GeometryObject, Topology } from 'topojson-specification';

export enum CommunityType {
  Region = 'REG',
  Departement = 'DEP',
  Commune = 'COM',
  /** Metropole au sens de la ville principale d une region geographique */
  Metropole = 'MET',
  /** Collectivite territoriale unique (ex: Corse, Martinique, Guyane) */
  CTU = 'CTU',
  /** Communaute d'agglomerations */
  CA = 'CA',
  /** Communaute de communes */
  CC = 'CC',
  /** Etablissement public territorial */
  EPT = 'EPT',
}

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
