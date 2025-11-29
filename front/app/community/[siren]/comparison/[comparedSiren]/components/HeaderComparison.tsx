'use client';

import type { Community } from '#app/models/community';
import { Card } from '#components/ui/card';
import SectionSeparator from '#components/utils/SectionSeparator';
import { formatNumberInteger, getNextTranche } from '#utils/utils';

import { CommunityDetails } from '../../../components/CommunityDetails';
import { useComparisonYear } from './hooks/useComparisonYear';
import { SideBySideComparison } from './shared/SideBySideComparison';

type HeaderComparisonProps = {
  community1: Community;
  community2: Community;
  budgetTotal1?: number | null;
  budgetTotal2?: number | null;
};

export function HeaderComparison({
  community1,
  community2,
  budgetTotal1,
  budgetTotal2,
}: HeaderComparisonProps) {
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
          leftChild={
            <CommunityDetails community={community1} compare left budgetTotal={budgetTotal1} />
          }
          rightChild={
            <CommunityDetails community={community2} compare budgetTotal={budgetTotal2} />
          }
        />
      </div>

      {/* Mobile layout - unified card */}
      <div className='my-6 md:hidden'>
        <MobileHeaderCard
          community1={community1}
          community2={community2}
          budgetTotal1={budgetTotal1}
          budgetTotal2={budgetTotal2}
        />
      </div>
    </>
  );
}

type MobileHeaderCardProps = {
  community1: Community;
  community2: Community;
  budgetTotal1?: number | null;
  budgetTotal2?: number | null;
};

function MobileHeaderCard({
  community1,
  community2,
  budgetTotal1,
  budgetTotal2,
}: MobileHeaderCardProps) {
  const renderInfoBlock = (
    label: string,
    value1: string,
    value2: string,
    bgColor1: string,
    bgColor2: string,
    isTailleAdministration: boolean = false,
  ) => (
    <>
      <h4 className='mb-3 text-sm font-semibold text-primary-900'>{label}</h4>
      <div className='flex gap-2'>
        <MobileInfoBlock
          value={value1}
          bgColor={bgColor1}
          isTailleAdministration={isTailleAdministration}
        />
        <MobileInfoBlock
          value={value2}
          bgColor={bgColor2}
          isTailleAdministration={isTailleAdministration}
        />
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

      {/* Section Budget Total */}
      <div className='mb-4 border-b pb-4'>
        {renderInfoBlock(
          'Budget total (en millions d’€)',
          budgetTotal1 ? formatNumberInteger(Math.round(budgetTotal1 / 1_000_000)) : '—',
          budgetTotal2 ? formatNumberInteger(Math.round(budgetTotal2 / 1_000_000)) : '—',
          'bg-brand-3',
          'bg-primary-light',
        )}
      </div>

      {/* Section Nombre d'agents */}
      <div>
        {renderInfoBlock(
          "Taille de l'administration (agents)",
          formatNumberInteger(community1.tranche_effectif),
          formatNumberInteger(community2.tranche_effectif),
          'bg-brand-3',
          'bg-primary-light',
          true,
        )}
      </div>
    </Card>
  );
}

type MobileInfoBlockProps = {
  isTailleAdministration?: boolean;
  value: string;
  bgColor: string;
};

function MobileInfoBlock({ value, bgColor, isTailleAdministration = false }: MobileInfoBlockProps) {
  // Extract the numeric value from the formatted string
  const numericValue = Number.parseInt(value.replace(/\s/g, ''), 10) || 0;

  return (
    <div className={`flex-1 rounded-none rounded-br-2xl rounded-tl-2xl p-3 ${bgColor}`}>
      {isTailleAdministration && numericValue >= 5000 && (
        <span className='text-base font-normal sm:inline'>Plus de </span>
      )}
      <span className='text-lg font-bold text-primary-900'>{value}</span>
      {isTailleAdministration && numericValue > 0 && numericValue < 5000 && (
        <>
          <span className='text-base font-normal sm:inline'> à </span>
          <span className='text-lg font-bold text-primary-900'>
            {formatNumberInteger(getNextTranche(numericValue))}
          </span>
        </>
      )}
    </div>
  );
}
