export type SimilarCommunity = {
  siren: string;
  nom: string;
};

export type MPSubvComparison = {
  /** Primary key [char9] */
  siren: string;
  /** Primary key */
  year: number;
  total_amount: number;
  total_number: number;
  top5: MPSubvKeyData[];
  community_name: string;
};

export type MPSubvKeyData = {
  label: string;
  value: number;
};

export type MarchesPublicsComparisonData = {
  year: string;
  community: number;
  communityLabel: string;
  regional: number;
  regionalLabel: string;
  communityMissing?: boolean;
  regionalMissing?: boolean;
};

export type SubventionsComparisonData = {
  year: string;
  community: number;
  communityLabel: string;
  regional: number;
  regionalLabel: string;
  communityMissing?: boolean;
  regionalMissing?: boolean;
};
