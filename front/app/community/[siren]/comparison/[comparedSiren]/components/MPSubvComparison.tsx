'use client';

import { memo, useCallback, useMemo } from 'react';

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

  // Memoize section title to prevent recalculation
  const sectionTitle = useMemo(() => getSectionTitle(comparisonType), [comparisonType]);

  // Stabilize year selection handler
  const handleYearSelect = useCallback(
    (year: number) => {
      setSelectedYear(year);
    },
    [setSelectedYear],
  );

  return (
    <>
      <SectionSeparator
        sectionTitle={sectionTitle}
        year={selectedYear}
        onSelectYear={handleYearSelect}
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

const ComparingMPSubv = memo(
  ({ siren, year, comparisonType, bgColor }: ComparingMPSubvProperties) => {
    const { data, isPending, isError } = useMPSubvComparison(siren, year, comparisonType);

    // Show EmptyState for actual errors or missing data
    if (isError || (!isPending && (!data || data.top5 === undefined))) {
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
        totalAmount={data?.total_amount || 0}
        totalNumber={data?.total_number || 0}
        top5Items={data?.top5 || null}
        comparisonName={getName(comparisonType)}
        columnLabel={getColumnLabel(comparisonType)}
        bgColor={bgColor}
        isLoadingDetails={isPending}
      />
    );
  },
);

ComparingMPSubv.displayName = 'ComparingMPSubv';

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

const MobileMPSubvCard = memo(({ siren1, siren2, year, comparisonType }: MobileMPSubvCardProps) => {
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

  // Memoize comparison name to prevent recalculation
  const comparisonName = useMemo(() => getName(comparisonType), [comparisonType]);

  const renderInfoBlock = useCallback(
    (label: string, value1: string, value2: string) => (
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
    ),
    [],
  );

  if (isPending1 || isPending2) {
    return <Loading />;
  }

  // Check if both communities have no data
  const hasData1 = !isError1 && data1 && data1.top5 !== undefined;
  const hasData2 = !isError2 && data2 && data2.top5 !== undefined;

  // Only show empty state if BOTH communities have no data
  if (!hasData1 && !hasData2) {
    return (
      <EmptyState
        title={`Aucune donnée de ${comparisonName} disponible`}
        description={`Il n'y a pas de données de ${comparisonName} disponibles pour cette période.`}
        siren={siren1}
        className='h-full'
      />
    );
  }

  return (
    <Card className='space-y-6 p-4'>
      {/* Comparaison Montant Total - Only show if both have data */}
      {hasData1 && hasData2 && (
        <div className='border-b pb-4'>
          {renderInfoBlock(
            'Montant total',
            formatCompactPrice(data1.total_amount),
            formatCompactPrice(data2.total_amount),
          )}
        </div>
      )}

      {/* Comparaison Nombre - Only show if both have data */}
      {hasData1 && hasData2 && (
        <div className='border-b pb-4'>
          {renderInfoBlock(
            `Nombre de ${comparisonName}`,
            data1.total_number.toString(),
            data2.total_number.toString(),
          )}
        </div>
      )}

      {/* Tableaux détaillés */}
      <div className='space-y-6'>
        {hasData1 ? (
          <TableInfoBlock
            totalAmount={data1.total_amount}
            totalNumber={data1.total_number}
            top5Items={data1.top5}
            comparisonName={comparisonName}
            columnLabel={getColumnLabel(comparisonType)}
            communityName={formatLocationName(data1?.community_name || 'N/A')}
            bgColor='bg-brand-3'
          />
        ) : (
          <EmptyState
            title={`Aucune donnée de ${comparisonName} disponible`}
            description={`Il n'y a pas de données de ${comparisonName} disponibles pour cette période pour ${formatLocationName(data1?.community_name || 'cette collectivité')}.`}
            siren={siren1}
            className='h-full'
          />
        )}

        {hasData2 ? (
          <TableInfoBlock
            totalAmount={data2.total_amount}
            totalNumber={data2.total_number}
            top5Items={data2.top5}
            comparisonName={comparisonName}
            columnLabel={getColumnLabel(comparisonType)}
            communityName={formatLocationName(data2?.community_name || 'N/A')}
            bgColor='bg-primary-light'
          />
        ) : (
          <EmptyState
            title={`Aucune donnée de ${comparisonName} disponible`}
            description={`Il n'y a pas de données de ${comparisonName} disponibles pour cette période pour ${formatLocationName(data2?.community_name || 'cette collectivité')}.`}
            siren={siren2}
            className='h-full'
          />
        )}
      </div>
    </Card>
  );
});

MobileMPSubvCard.displayName = 'MobileMPSubvCard';
