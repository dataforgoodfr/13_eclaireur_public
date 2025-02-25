export enum CommunityType {
    Communes = 'communes',
    Departements = 'departements',
    Regions = 'regions',
  }


export type Community = {
  siren: string,
  nom: string,
  type:  string,
  population: number,
  longitude: number,
  latitude: number,
}