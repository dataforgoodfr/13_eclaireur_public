export type Subvention = {
  /** Primary key [char9] */
  id_attribuant: string;
  /** Primary key */
  id_beneficiaire: string;
  Libellé_naf_n1_beneficiaire:string;
  Libellé_naf_n2_beneficiaire:string;
  Libellé_naf_n3_beneficiaire:string;
  Libellé_naf_n4_beneficiaire:string;
  Libellé_naf_n5_beneficiaire:string;
  annee: number;
  categorie_juridique_n1_name_beneficiaire: string;
  categorie_juridique_n2_name_beneficiaire: string;
  categorie_juridique_n3_name_beneficiaire: string;
  category_usage:string;
  code_ju_beneficiaire:string;
  coll_type: number;
  conditions_versement:string;
  date_convention: string;
  dates_periode_versement: string;
  dispositif_aide:string;
  id_rae:string;
  is_active_beneficiaire:boolean;
  is_valid_siren_beneficiaire:boolean;
  montant: number;
  naf8_beneficiaire:string;
  nature:string;
  nom_attribuant: string;
  nom_beneficiaire: string;
  nomenclature_naf_beneficiaire:string;
  notification_ue:string;
  objet: string;
  pourcentage_subvention:string;
  raison_sociale_prenom_beneficiaire:string;
  reference_decision:string;
  rna_beneficiaire:string;
  topic:string;
  tranche_effectif_beneficiaire:number;
  url: string;
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
