'use client';

import type { Community } from '#app/models/community';
import EmptyState from '#components/EmptyState';
import Loading from '#components/ui/Loading';
import { Card } from '#components/ui/card';
import SectionSeparator from '#components/utils/SectionSeparator';
import { formatLocationName } from '#utils/format';
import { useMPSubvComparison } from '#utils/hooks/comparison/useMPSubvComparison';
import { formatCompactPrice } from '#utils/utils';

import { ComparisonType } from './ComparisonType';
import { TableInfoBlock } from './TableInfoBlock';
import { useComparisonYear } from './hooks/useComparisonYear';
import { SideBySideComparison } from './shared/SideBySideComparison';

type MPSubvComparisonProperties = {
  community1: Community;
  community2: Community;
  comparisonType: ComparisonType;
};

export function MPSubvComparison({
  community1,
  community2,
  comparisonType,
}: MPSubvComparisonProperties) {
  const { year: selectedYear, setYear: setSelectedYear } = useComparisonYear();

  return (
    <>
      <SectionSeparator
        sectionTitle={getSectionTitle(comparisonType)}
        year={selectedYear}
        onSelectYear={setSelectedYear}
      />
      {/* Desktop layout */}
      <div className='hidden md:block'>
        <SideBySideComparison
          leftChild={
            <ComparingMPSubv
              siren={community1.siren}
              year={selectedYear as number}
              comparisonType={comparisonType}
              bgColor='bg-brand-3'
            />
          }
          rightChild={
            <ComparingMPSubv
              siren={community2.siren}
              year={selectedYear as number}
              comparisonType={comparisonType}
              bgColor='bg-primary-light'
            />
          }
          className='my-10'
        />
      </div>

      {/* Mobile layout - unified card */}
      <div className='my-6 md:hidden'>
        <MobileMPSubvCard
          siren1={community1.siren}
          siren2={community2.siren}
          year={selectedYear as number}
          comparisonType={comparisonType}
        />
      </div>
    </>
  );
}

type ComparingMPSubvProperties = {
  siren: string;
  year: number;
  comparisonType: ComparisonType;
  bgColor?: string;
};

function ComparingMPSubv({ siren, year, comparisonType, bgColor }: ComparingMPSubvProperties) {
  const { data, isPending, isError } = useMPSubvComparison(siren, year, comparisonType);

  // Show loading state
  if (isPending) {
    return <Loading />;
  }

  // Show EmptyState for actual errors or missing data
  if (isError || !data || data.top5 === undefined) {
    return (
      <EmptyState
        title={`Aucune donnée de ${getName(comparisonType)} disponible`}
        description={`Il n'y a pas de données de ${getName(comparisonType)} disponibles pour cette période. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés.`}
        siren={siren}
        className='h-full'
      />
    );
  }

  return (
    <TableInfoBlock
      totalAmount={data.total_amount}
      totalNumber={data.total_number}
      top5Items={data.top5}
      comparisonName={getName(comparisonType)}
      columnLabel={getColumnLabel(comparisonType)}
      bgColor={bgColor}
    />
  );
}

function getSectionTitle(comparisonType: ComparisonType) {
  switch (comparisonType) {
    case ComparisonType.Marches_Publics:
      return 'Marchés publics';
    case ComparisonType.Subventions:
      return 'Subventions';
    default:
      return '';
  }
}

function getName(comparisonType: ComparisonType) {
  switch (comparisonType) {
    case ComparisonType.Marches_Publics:
      return 'marchés publics';
    case ComparisonType.Subventions:
      return 'subventions';
    default:
      return '';
  }
}

function getColumnLabel(comparisonType: ComparisonType) {
  switch (comparisonType) {
    case ComparisonType.Marches_Publics:
      return 'Objet';
    case ComparisonType.Subventions:
      return 'Bénéficiaire';
    default:
      return '';
  }
}

type MobileMPSubvCardProps = {
  siren1: string;
  siren2: string;
  year: number;
  comparisonType: ComparisonType;
};

function MobileMPSubvCard({ siren1, siren2, year, comparisonType }: MobileMPSubvCardProps) {
  const {
    data: data1,
    isPending: isPending1,
    isError: isError1,
  } = useMPSubvComparison(siren1, year, comparisonType);

  const {
    data: data2,
    isPending: isPending2,
    isError: isError2,
  } = useMPSubvComparison(siren2, year, comparisonType);

  if (isPending1 || isPending2) {
    return <Loading />;
  }

  if (
    isError1 ||
    isError2 ||
    !data1 ||
    !data2 ||
    data1.top5 === undefined ||
    data2.top5 === undefined
  ) {
    return (
      <EmptyState
        title={`Aucune donnée de ${getName(comparisonType)} disponible`}
        description={`Il n'y a pas de données de ${getName(comparisonType)} disponibles pour cette période.`}
        siren={siren1}
        className='h-full'
      />
    );
  }

  const renderInfoBlock = (label: string, value1: string, value2: string) => (
    <>
      <h4 className='mb-3 text-sm font-semibold text-primary-900'>{label}</h4>
      <div className='flex justify-between'>
        <div className='rounded-full bg-brand-3 px-4 py-2'>
          <span className='text-lg font-bold text-primary-900'>{value1}</span>
        </div>
        <div className='rounded-full bg-primary-light px-4 py-2'>
          <span className='text-lg font-bold text-primary-900'>{value2}</span>
        </div>
      </div>
    </>
  );

  return (
    <Card className='space-y-6 p-4'>
      {/* Comparaison Montant Total */}
      <div className='border-b pb-4'>
        {renderInfoBlock(
          'Montant total',
          formatCompactPrice(data1.total_amount),
          formatCompactPrice(data2.total_amount),
        )}
      </div>

      {/* Comparaison Nombre */}
      <div className='border-b pb-4'>
        {renderInfoBlock(
          `Nombre de ${getName(comparisonType)}`,
          data1.total_number.toString(),
          data2.total_number.toString(),
        )}
      </div>

      {/* Tableaux détaillés */}
      <div className='space-y-6'>
        <TableInfoBlock
          totalAmount={data1.total_amount}
          totalNumber={data1.total_number}
          top5Items={data1.top5}
          comparisonName={getName(comparisonType)}
          columnLabel={getColumnLabel(comparisonType)}
          communityName={formatLocationName(data1?.community_name || 'N/A')}
          bgColor='bg-brand-3'
        />

        <TableInfoBlock
          totalAmount={data2.total_amount}
          totalNumber={data2.total_number}
          top5Items={data2.top5}
          comparisonName={getName(comparisonType)}
          columnLabel={getColumnLabel(comparisonType)}
          communityName={formatLocationName(data2?.community_name || 'N/A')}
          bgColor='bg-primary-light'
        />
      </div>
    </Card>
  );
}
