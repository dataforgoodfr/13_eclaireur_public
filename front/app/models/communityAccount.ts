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
