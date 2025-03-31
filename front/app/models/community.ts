export type Community = {
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
  code: string;
};
