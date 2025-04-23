'use client';

import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCompactPrice, formatFirstLetterToUppercase, formatNumber } from '@/utils/utils';

import PercentageBarCell from './PercentageBarCell';

export type SectorRow = {
  id: string;
  name: string;
  amount: number;
  /** Percentage from 0 to 1 */
  percentage: number;
};

type SectorTableProps = { data: SectorRow[]; onLoadMore: (limit: number) => void };

export default function SectorTable({ data, onLoadMore }: SectorTableProps) {
  const [linesDisplayed, setLinesDisplayed] = useState(0);

  function formatPercentage(percentage: number) {
    return `${formatNumber(percentage)}%`;
  }

  return (
    <div className='min-h-[600px]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[400px]'>Secteur</TableHead>
            <TableHead className='w-[700px]'></TableHead>
            <TableHead className=''>Montant</TableHead>
            <TableHead className='text-right'>Part</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ id, name, percentage, amount }) => (
            <TableRow key={id}>
              <TableCell className='font-medium'>{formatFirstLetterToUppercase(name)}</TableCell>
              <PercentageBarCell value={percentage * 100} />
              <TableCell>{formatCompactPrice(amount)}</TableCell>
              <TableCell className='text-right'>{formatPercentage(percentage)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        <div className='flex items-center justify-center pt-6'>
          <button
            className='rounded-md bg-neutral-600 px-3 py-1 text-neutral-100 hover:bg-neutral-800'
            onClick={() => setLinesDisplayed(linesDisplayed + 1)}
          >
            Voir plus
          </button>
        </div>
      }
    </div>
  );
}
