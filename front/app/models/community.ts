export type Community = {
  /** Primary key [char9] */
  siren: string;
  /** Primary key */
  type: string;
  nom: string;
  code_insee: string;
  code_insee_departement: string;
  code_insee_region: string;
  categorie: string;
  population: number;
  siren_epci: string;
  naf8: string;
  tranche_effectif: number;
  id_datagouv: string;
  url_platfom: string;
  techno_platfom: string;
  effectifs_sup_50: boolean;
  should_publish: boolean;
  outre_mer: boolean;
  code_postal?: number;
};

/** @deprecated use Community instead */
export type CommunityV0 = {
  /** Primary key [char9] */
  siren: string;
  /** Primary key */
  type: string;
  nom: string;
  cog: string;
  code_departement: string;
  code_region: string;
  epci: string;
  latitude: number;
  longitude: number;
  population: number;
  superficie: number;
  obligation_publication: boolean;
  nom_elu: string;
};
