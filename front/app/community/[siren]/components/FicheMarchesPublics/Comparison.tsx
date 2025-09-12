'use client';

import ComparisonContainer from '#components/DataViz/ComparisonContainer';
import { MARCHES_PUBLICS_THEME } from '#utils/comparisonThemes';
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
      apiEndpoint={`/api/communities/${siren}/marches_publics/comparison`}
      theme={MARCHES_PUBLICS_THEME}
      dataType='marches-publics'
    />
  );
}
