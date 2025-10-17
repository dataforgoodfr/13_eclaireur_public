import type { CommunityType } from '#utils/types';

import type { Paginated } from './pagination';

// TODO - add all keys
export type MarchePublic = {
  id_mp: number;
  /** Siren acheteur (collectivite) */
  acheteur_id: string;
  objet: string;
  titulaire_denomination_sociale: string;
  montant_du_marche_public: number;
  montant_du_marche_public_par_titulaire: number;
  codecpv: string;
  cpv_8: string;
  cpv_8_label: string;
  cpv_2: string;
  cpv_2_label: string;
  annee_notification: number;
  annee_publication_donnees: number;
  source: string;
};

/** @deprecated use MarchePublic instead */
export type MarchePublicV0 = {
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
  montant: number;
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

export type MarchePublicSector = Paginated<
  Pick<MarchePublic, 'cpv_2' | 'cpv_2_label'> & {
    /** Aggregated objects for this sector */
    objet?: string;
    /** Total of the community of the sector for a year */
    montant: number;
    /** Total of the community for a year */
    grand_total: number;
  }
>;

export type PaginatedMarchePublic = Paginated<
  Pick<MarchePublic, 'id_mp' | 'objet' | 'montant_du_marche_public' | 'montant_du_marche_public_par_titulaire' | 'annee_notification'>
> & {
  titulaire_names: string[];
};
