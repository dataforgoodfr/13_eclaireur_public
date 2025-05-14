import { TransparencyScore } from '@/components/TransparencyScore/constants';

export type Community = {
  /** Primary key [char9] */
  siren: string | null;
  total_produits: TransparencyScore;
  total_charges: string;
  resultat: string;
  tranche_effectif: number;
  subventions: string;
  ressources_invest: string;
  emploi_invest: string;
  ebf: boolean;
  caf: boolean;
  dette: boolean;
  annee: number;
};
export type CommunityAccount = {
  /** Primary key [char9] */
  siren: string | null;
  region: string;
  total_produits: TransparencyScore;
  total_charges: number;
  resultat: number;
  subventions: number;
  ressources_invest: number;
  emploi_invest: number;
  ebf: number;
  caf: number;
  population: string;
  dette: number;
  annee: number;
  insee_commune: string;
  dept: string;
  type: string;
  region_clean: string;
  dep_clean: string;
  insee_commune_clean: string;
  nom_reg: string;
  nom_dept: string;
  nom_com: string;
};
