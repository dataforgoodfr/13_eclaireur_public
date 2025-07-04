'use client';

// TODO: Replace all `any` types with proper interfaces/types for better type safety.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import DownloadButton from '@/app/community/[siren]/components/DownloadDataButton';
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

export default function Ranking({
  data,
  availableYears,
}: {
  data: Subvention[];
  availableYears: number[];
}) {
  const defaultYear: YearOption = availableYears.length > 0 ? Math.max(...availableYears) : 'All';
  const [linesDisplayed, setLinesDisplayed] = useState(0);
  const [selectedYear, setSelectedYear] = useState<YearOption>(defaultYear);

  const filteredData =
    selectedYear === 'All'
      ? data
      : data.filter((item) => String(item.annee) === String(selectedYear));

  function formatSubventionObject(input: string): string[] {
    return input
      .replace(/[\[\]]/g, '') // Supprime les crochets
      .replace(/\\r\\n|\r\n|\n/g, ' ') // Retire les \n\r
      .split(/',|",/) // Split sur des virgules
      .map((item) =>
        item
          .trim()
          .replace(/^['"]|['"]$/g, '')
          .toLocaleUpperCase(),
      );
  }

  function getTopSubs(data: any[]) {
    const sortedSubs = data.sort((a, b) => Number(b.montant) - Number(a.montant));
    const topSubs =
      sortedSubs.length > ROWS_COUNT + ROWS_COUNT * linesDisplayed
        ? sortedSubs.slice(0, ROWS_COUNT + ROWS_COUNT * linesDisplayed)
        : sortedSubs;

    return topSubs;
  }

  const topSubsData = getTopSubs(filteredData);

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Classement par tailles de subventions</h3>
        </div>
        <div className='flex items-center gap-2'>
          {/* TODO: Fix year selector with this table */}
          <YearSelector defaultValue={defaultYear} onSelect={setSelectedYear} />
          <DownloadButton />
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
          {topSubsData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className='font-medium'>
                <div className='line-clamp-1 overflow-hidden text-ellipsis'>
                  {item.nom_beneficiaire}
                </div>
              </TableCell>
              <TableCell>
                <div className='line-clamp-1 overflow-hidden text-ellipsis'>
                  {formatSubventionObject(item.objet).map((item, index) => (
                    <span key={index}>
                      {index > 0 && ' - '}
                      {item}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className='text-right'>
                {formatCompactPrice(parseFloat(item.montant))}
              </TableCell>
              <TableCell className='text-right'>{item.annee}</TableCell>
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
