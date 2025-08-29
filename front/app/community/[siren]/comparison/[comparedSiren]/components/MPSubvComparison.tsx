'use client';

import EmptyState from '#components/EmptyState';
import Loading from '#components/ui/Loading';
import {
  Table as ShadCNTable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table';
import SectionSeparator from '#components/utils/SectionSeparator';
import { useMPSubvComparison } from '#utils/hooks/comparison/useMPSubvComparison';
import { formatCompactPrice } from '#utils/utils';

import { ComparisonType } from './ComparisonType';
import { useComparisonYear } from './hooks/useComparisonYear';
import { SideBySideComparison } from './shared/SideBySideComparison';

type MPSubvComparisonProperties = {
  siren1: string;
  siren2: string;
  comparisonType: ComparisonType;
};

export function MPSubvComparison({ siren1, siren2, comparisonType }: MPSubvComparisonProperties) {
  const { year: selectedYear, setYear: setSelectedYear } = useComparisonYear();

  return (
    <>
      <SectionSeparator
        sectionTitle={getSectionTitle(comparisonType)}
        year={selectedYear}
        onSelectYear={setSelectedYear}
      />
      <SideBySideComparison
        leftChild={
          <ComparingMPSubv
            siren={siren1}
            year={selectedYear as number}
            comparisonType={comparisonType}
          />
        }
        rightChild={
          <ComparingMPSubv
            siren={siren2}
            year={selectedYear as number}
            comparisonType={comparisonType}
          />
        }
        className='max-md:my-6 md:my-10'
      />
    </>
  );
}

type ComparingMPSubvProperties = {
  siren: string;
  year: number;
  comparisonType: ComparisonType;
};

function ComparingMPSubv({ siren, year, comparisonType }: ComparingMPSubvProperties) {
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
    <div className=''>
      <div className='flex flex-row items-center justify-center gap-2'>
        <h4>
          Montant total :{' '}
          <div className='rounded-full bg-brand-2 p-2'>{formatCompactPrice(data.total_amount)}</div>
        </h4>
      </div>
      <div className='flex flex-row items-center justify-center gap-2'>
        <h4>
          Nombre de {getName(comparisonType)} : {data.total_number}
        </h4>
      </div>
      <div className='md:mx-5'>
        <ShadCNTable className='text-xs sm:text-sm'>
          <TableCaption>Top 5 des {getName(comparisonType)}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='text-left'>{getColumnLabel(comparisonType)}</TableHead>
              <TableHead className='w-[75px] text-right'>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.top5.map(({ label, value }, index) => (
              <TableRow key={index}>
                <TableCell className='text-left'>
                  {label !== null ? label.toLocaleUpperCase() : 'Non précisé'}
                </TableCell>
                <TableCell className='text-right'>{formatCompactPrice(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ShadCNTable>
      </div>
    </div>
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
