export type Subvention = {
  /** Siren de la collectivite */
  id_attribuant: string;
  /** Primary key */
  attribuant_type: string;
  /** Siren du beneficiaire */
  id_beneficiaire: string;
  beneficiaire_nom: string;
  nom: string;
  type: string;
  objet: string;
  source: string;
  year: number;
  url: string;
  tendance: number;
  naf8_beneficiaire: string;
  section_naf: string;
  naf_subsector: string;
  naf_subsubsector: string;
  code_commune_etablissement: string;
  categorie_juridique_n1_name_beneficiaire: string;
  categorie_juridique_n2_name_beneficiaire: string;
  categorie_juridique_n3_name_beneficiaire: string;
  dates_versement: string[];
  data_convention: string[];
  montant_per_sub: number[];
  montant: number;
  nombre_subventions: number;
};

/** @deprecated use Subvention instead */
export type SubventionV0 = {
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

export type SubventionSector = {
  /** Using naf2 to represent the sector */
  naf2: string;
  label: string;
  /** Total of the community of the naf section for a year */
  montant: number;
  /** Total of the community for a year */
  grand_total: number;
  total_row_count: number;
};
