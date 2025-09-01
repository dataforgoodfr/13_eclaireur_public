'use client';

import type { Community } from '#app/models/community';
import { Card } from '#components/ui/card';
import SectionSeparator from '#components/utils/SectionSeparator';
import { formatNumberInteger } from '#utils/utils';

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
      {/* Desktop layout */}
      <div className='hidden md:block'>
        <SideBySideComparison
          leftChild={<CommunityDetails community={community1} compare left />}
          rightChild={<CommunityDetails community={community2} compare />}
        />
      </div>

      {/* Mobile layout - unified card */}
      <div className='my-6 md:hidden'>
        <MobileHeaderCard community1={community1} community2={community2} />
      </div>
    </>
  );
}

type MobileHeaderCardProps = {
  community1: Community;
  community2: Community;
};

function MobileHeaderCard({ community1, community2 }: MobileHeaderCardProps) {
  const renderInfoBlock = (
    label: string,
    value1: string,
    value2: string,
    bgColor1: string,
    bgColor2: string,
  ) => (
    <>
      <h4 className='mb-3 text-sm font-semibold text-primary-900'>{label}</h4>
      <div className='flex gap-2'>
        <div className={`flex-1 rounded-none rounded-br-2xl rounded-tl-2xl p-3 ${bgColor1}`}>
          <span className='text-lg font-bold text-primary-900'>{value1}</span>
        </div>
        <div className={`flex-1 rounded-none rounded-br-2xl rounded-tl-2xl p-3 ${bgColor2}`}>
          <span className='text-lg font-bold text-primary-900'>{value2}</span>
        </div>
      </div>
    </>
  );

  return (
    <Card className='p-4'>
      {/* Header avec les noms des villes */}
      <div className='mb-4 flex items-center justify-between border-b pb-4'>
        <span className='text-sm font-medium text-primary'>{community1.nom}</span>
        <span className='text-sm font-medium text-primary'>{community2.nom}</span>
      </div>

      {/* Section Population */}
      <div className='mb-4 border-b pb-4'>
        {renderInfoBlock(
          'Population',
          formatNumberInteger(community1.population),
          formatNumberInteger(community2.population),
          'bg-brand-3',
          'bg-primary-light',
        )}
      </div>

      {/* Section Superficie */}
      <div className='mb-4 border-b pb-4'>
        {renderInfoBlock(
          'Superficie',
          formatNumberInteger(community1.superficie_ha || 0),
          formatNumberInteger(community2.superficie_ha || 0),
          'bg-brand-3',
          'bg-primary-light',
        )}
      </div>

      {/* Section Nombre d'agents */}
      <div>
        {renderInfoBlock(
          "Nombre d'agents",
          formatNumberInteger(community1.tranche_effectif),
          formatNumberInteger(community2.tranche_effectif),
          'bg-brand-3',
          'bg-primary-light',
        )}
      </div>
    </Card>
  );
}
