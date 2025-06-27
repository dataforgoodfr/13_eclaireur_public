import { TransparencyScore } from '@/components/TransparencyScore/constants';

export type MPSubvComparison = {
  /** Primary key [char9] */
  siren: string;
  /** Primary key */
  year: number;
  total_amount: number;
  total_number: number;
  top5: MPSubvKeyData[];
};

export type MPSubvKeyData = {
  label: string;
  value: number;
};
