'use client';

import type { Community } from '#app/models/community';
import SectionSeparator from '#components/utils/SectionSeparator';

import { CommunityDetails } from '../../../components/CommunityDetails';
import { useComparisonYear } from './hooks/useComparisonYear';
import { SideBySideComparison } from './shared/SideBySideComparison';

type HeaderComparisonProps = {
  community1: Community;
  community2: Community;
};

export function HeaderComparison({ community1, community2 }: HeaderComparisonProps) {
  const { year: selectedYear, setYear: setSelectedYear } = useComparisonYear();

  return (
    <>
      <SectionSeparator
        sectionTitle='Informations générales'
        year={selectedYear}
        onSelectYear={setSelectedYear}
      />
      <SideBySideComparison
        leftChild={<CommunityDetails community={community1} compare left />}
        rightChild={<CommunityDetails community={community2} compare />}
      />
    </>
  );
}
