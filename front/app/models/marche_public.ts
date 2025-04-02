import { CommunityType } from '@/utils/types';

export type MarchePublic = {
  id_postgre: number;
  /** Primary key [char9] */
  acheteur_siren: string;
  /** Primary key */
  acheteur_type: CommunityType;
  acheteur_nom: string;
  acheteur_sirene: string;
  titulaires_liste_noms: string[];
  titulaires_nombre: number;
  objet: string;
  nature: string;
  formeprix: string;
  lieuexecution_code: string;
  lieuexecution_typecode: string;
  lieuexecution_nom: string;
  montant: string;
  dureemois: number;
  procedure: string;
  codecpv: string;
  cpv_8: string;
  cpv_8_label: string;
  cpv_2: string;
  cpv_2_label: string;
  obligation_publication: boolean;
  datenotification: string;
  datenotification_annee: number;
  datepublication: string;
  datepublication_annee: number;
  delaipublication_jours: number;
};
