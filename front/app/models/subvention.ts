export type Subvention = {
  id_postgre: number;
  /** Primary key [char9] */
  attribuant_siren: string;
  /** Primary key */
  attribuant_type: string;
  beneficiaire_siret: string;
  beneficiaire_siren: string;
  beneficiaire_nom: string;
  nom: string;
  type: string;
  objet: string;
  source: string;
  year: number;
  url: string[];
  tendance: number;
  section_naf: string;
  naf_subsector: string;
  naf_subsubsector: string;
  code_commune_etablissement: string;
  beneficiaire_catjuridique_n1: string;
  beneficiaire_catjuridique_n2: string;
  beneficiaire_catjuridique_n3: string;
  dates_versement: string[];
  data_convention: string[];
  montant_per_sub: number[];
  montant: number;
  nombre_subventions: number;
};
