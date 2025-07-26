'use client';

import { useState } from 'react';

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

import { YearOption } from '../../../types/interface';
import { ComparisonType } from './ComparisonType';

type MPSubvComparisonProperties = {
  siren1: string;
  siren2: string;
  comparisonType: ComparisonType;
};

export function MPSubvComparison({ siren1, siren2, comparisonType }: MPSubvComparisonProperties) {
  const defaultYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<YearOption>(defaultYear);

  return (
    <>
      <SectionSeparator
        sectionTitle={getSectionTitle(comparisonType)}
        year={selectedYear}
        onSelectYear={setSelectedYear}
      />
      <div className='flex justify-around max-md:my-6 md:my-10'>
        <ComparingMPSubv
          siren={siren1}
          year={selectedYear as number}
          comparisonType={comparisonType}
        />
        <ComparingMPSubv
          siren={siren2}
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
};

function ComparingMPSubv({ siren, year, comparisonType }: ComparingMPSubvProperties) {
  const { data, isPending, isError } = useMPSubvComparison(siren, year, comparisonType);

  if (isPending || isError) {
    return <Loading />;
  }

  if (data.top5 === undefined) {
    return (
      <div className='mx-2 basis-1/2 flex-col space-y-2 text-center'>Aucunes données publiées</div>
    );
  }

  return (
    <div className='basis-1/2 flex-col space-y-2 text-center sm:mx-2'>
      <p>Montant total : {formatCompactPrice(data.total_amount)}</p>
      <p>
        Nombre de {getName(comparisonType)} : {data.total_number}
      </p>
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
