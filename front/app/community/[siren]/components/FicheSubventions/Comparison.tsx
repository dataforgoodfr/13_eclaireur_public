'use client';

import ComparisonContainer from '#components/DataViz/ComparisonContainer';
import { SUBVENTIONS_THEME } from '#utils/comparisonThemes';
import type { CommunityType } from '#utils/types';

type ComparisonProps = {
  siren: string;
  communityType?: CommunityType;
};

export default function Comparison({ siren, communityType }: ComparisonProps) {
  return (
    <ComparisonContainer
      siren={siren}
      communityType={communityType}
      apiEndpoint={`/api/communities/${siren}/subventions/comparison`}
      theme={SUBVENTIONS_THEME}
      dataType='subventions'
    />
  );
}
