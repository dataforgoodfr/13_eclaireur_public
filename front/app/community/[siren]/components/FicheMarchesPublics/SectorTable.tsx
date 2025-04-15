'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sector, TreeData } from '@/utils/types';
import { formatNumber } from '@/utils/utils';

import PercentageBarCell from './PercentageBarCell';
import { TestContext } from 'node:test';

type SectorTableProps = {
  topSectors: Sector[];
  formattedData: TreeData;
  linesDisplayed: number;
  onLoadMore: () => void;
};

export default function SectorTable({
  topSectors,
  formattedData,
  linesDisplayed,
  onLoadMore,
}: SectorTableProps) {
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
          {topSectors.map((item, index) => (
            <TableRow key={index}>
              <TableCell className='font-medium'>{item.name}</TableCell>
              <PercentageBarCell value={item.pourcentageCategoryTop1} />
              <TableCell>{formatNumber(Number(item.size))}</TableCell>
              <TableCell className='text-right'>{`${item.part}%`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {formattedData.type === 'node' &&
        formattedData.children &&
        formattedData.children.length > 10 + 10 * linesDisplayed && (
          <div className='flex items-center justify-center pt-6'>
            <button
              className='rounded-md bg-neutral-600 px-3 py-1 text-neutral-100 hover:bg-neutral-800'
              onClick={onLoadMore}
            >
              Voir plus
            </button>
          </div>
        )}
    </>
  );
}
