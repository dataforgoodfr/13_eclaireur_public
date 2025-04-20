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
import { firstLetterUppercase, formatCompactPrice } from '@/utils/utils';

import { TreeData } from '../../types/interface';
import PercentageBarCell from './PercentageBarCell';

export default function SectorTable({ data }: { data: TreeData }) {
  const [linesDisplayed, setLinesDisplayed] = useState(0);

  function getTopSectors(data: TreeData) {
    if (data.type === 'node') {
      const topSectors =
        data.children.length > 10 + 10 * linesDisplayed
          ? data.children.slice(0, 10 + 10 * linesDisplayed)
          : data.children;
      return topSectors;
    }
  }

  const topSectors = getTopSectors(data);

  return (
    <>
      <Table className='min-h-[600px]'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[400px]'>Secteur</TableHead>
            <TableHead className='w-[700px]'>Montant</TableHead>
            <TableHead className=''></TableHead>
            <TableHead className='text-right'>Part</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topSectors?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className='font-medium'>
                {firstLetterUppercase(item.name)}
              </TableCell>
              <PercentageBarCell value={Number(item.pourcentageCategoryTop1)} />
              <TableCell>{formatCompactPrice(Number(item.value))}</TableCell>
              <TableCell className='text-right'>{`${item.part}%`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data.type === 'node' && data.children && data.children.length > 10 + 10 * linesDisplayed && (
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
