export enum CommunityType {
  Region = 'REG',
  Departement = 'DEP',
  Communes = 'COM',
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

export type Community = {
  siren: string;
  nom: string;
  type: string;
  population: number;
  longitude: number;
  latitude: number;
};
