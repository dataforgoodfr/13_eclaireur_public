import { TransparencyScore } from '#components/TransparencyScore/constants';
import { CommunityType } from '#utils/types';

import { Paginated } from './pagination';

export type Community = {
  /** Primary key [char9] */
  siren: string;
  /** Primary key */
  type: CommunityType;
  nom: string;
  code_insee: string;
  code_insee_departement: string;
  code_insee_region: string;
  categorie: string;
  population: number;
  latitude: number | null;
  longitude: number | null;
  mp_score: TransparencyScore | null;
  subventions_score: TransparencyScore | null;
  siren_epci: string;
  naf8: string;
  tranche_effectif: number;
  superficie_ha: number | null;
  id_datagouv: string;
  url_platfom: string;
  techno_platfom: string;
  effectifs_sup_50: boolean;
  should_publish: boolean;
  outre_mer: boolean;
  code_postal: number | null;
};

export type AdvancedSearchCommunity = Paginated<
  Pick<Community, 'siren' | 'nom' | 'type' | 'population' | 'mp_score' | 'subventions_score'> & {
    subventions_budget: number;
  }
>;
