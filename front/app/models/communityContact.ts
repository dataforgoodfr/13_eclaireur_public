import { CommunityType } from '@/utils/types';

export type CommunityContact = {
  /** Primary key [char9] */
  siren: string;
  /** Primary key */
  type: CommunityType;
  nom: string;
  code_insee: string;
  contact: string;
  type_contact: 'MAIL' | 'WEB' | null;
  /** not in the db yet */
  fonction?: string;
  photoSrc?: string;
};
