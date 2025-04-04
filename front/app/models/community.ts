export type Community = {
  /** Primary key [char9] */
  siren: string;
  /** Primary key */
  // in database from pipeline
  outre_mer: string;
  code_insee_region: string;
  categorie: string;
  population: number;
  type: string;
  code_insee: string;
  code_insee_dept: string;
  nom: string;
  tranche_effectif: string;
  effectifs_sup_50: boolean;
  should_publish: boolean;
  code_postal: number;

  // not in database from pipeline
  cog: string; // to delete
  code_region: string; // to delete
  epci: string;
  latitude: number;
  longitude: number;
  superficie: number;
  obligation_publication: boolean;
  nom_elu: string; // to delete
  code: string; // to delete
};
