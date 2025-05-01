'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCompact, formatFirstLetterToUppercase, formatNumber } from '@/utils/utils';

import PercentageBarCell from './PercentageBarCell';

export type SectorRow = {
  id: string;
  name: string;
  amount: number;
  /** Percentage from 0 to 1 */
  percentage: number;
};

type SectorTableProps = { data: SectorRow[] };

export default function SectorTable({ data }: SectorTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[400px]'>Secteur</TableHead>
          <TableHead></TableHead>
          <TableHead className='w-[100px] text-right'>Montant (€)</TableHead>
          <TableHead className='w-[80px] text-right'>Part (%)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(({ id, name, percentage, amount }) => (
          <TableRow key={id}>
            <TableCell className='font-medium'>{formatFirstLetterToUppercase(name)}</TableCell>
            <PercentageBarCell value={percentage * 100} />
            <TableCell className='text-right'>{formatCompact(amount)}</TableCell>
            <TableCell className='text-right'>{formatNumber(percentage)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
