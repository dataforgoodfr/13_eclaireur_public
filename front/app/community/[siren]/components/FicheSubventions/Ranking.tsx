'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { Subvention } from '@/app/models/subvention';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCompactPrice } from '@/utils/utils'; 

import { YearOption } from '../../types/interface';

const ROWS_COUNT = 10;

function getAvailableYears(data: Subvention[]) {
  return [...new Set(data.map((item) => item.year && item.montant && item.year))].sort(
    (a: number, b: number) => a - b,
  );
}

export default function Ranking({ data }: { data: Subvention[] }) {
  const [linesDisplayed, setLinesDisplayed] = useState(0);
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');

  const availableYears: number[] = getAvailableYears(data);

  const filteredData =
    selectedYear === 'All'
      ? data
      : data.filter((item) => item.year === selectedYear);

  function formatSubventionObject(input: string): string[] {
    return input
      .replace(/[\[\]]/g, '')
      
      .split(/',\s*'|",\s*"/)
      .map((item) => item.replace(/^'|-'?$/g, '').trim());
  }

  function getTopContract(data: any[]) {
    const sortedContracts = data.sort((a, b) => Number(b.montant) - Number(a.montant));
    const topContract =
      sortedContracts.length > ROWS_COUNT + ROWS_COUNT * linesDisplayed
        ? sortedContracts.slice(0, ROWS_COUNT + ROWS_COUNT * linesDisplayed)
        : sortedContracts;

    return topContract;
  }

  const topContractData = getTopContract(filteredData);

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Classement par tailles de contrats</h3>
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector years={availableYears} onSelect={setSelectedYear} />
          <DownloadSelector />
        </div>
      </div>
      <Table className='min-h-[600px]'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[300px]'>Bénéficiaires</TableHead>
            <TableHead className=''>Objet</TableHead>
            <TableHead className='w-[140px] text-right'>Montant</TableHead>
            <TableHead className='w-[140px] text-right'>Année</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topContractData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className='font-medium'>
                {item.beneficiaire_nom}
              </TableCell>
              <TableCell className=''>{item.objet}</TableCell>
              <TableCell className='text-right'>
                {formatCompactPrice(parseFloat(item.montant))}
              </TableCell>
              <TableCell className='text-right'>{item.datenotification_annee}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredData.length > ROWS_COUNT + ROWS_COUNT * linesDisplayed && (
        <div className='flex items-center justify-center pt-6'>
          <button
            className='rounded-md bg-neutral-600 px-3 py-1 text-neutral-100 hover:bg-neutral-800'
            onClick={() => setLinesDisplayed(linesDisplayed + 1)}
          >
            Voir plus
          </button>
        </div>
      )}
    </>
  );
}
