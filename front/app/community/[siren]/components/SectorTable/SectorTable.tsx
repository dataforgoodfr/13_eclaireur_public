'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatAmount, formatCompact, formatFirstLetterToUppercase } from '@/utils/utils';

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
          <TableHead className='w-[80px] text-right'>Part (%)</TableHead>
          <TableHead className='w-[100px] text-right'>Montant (€)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(({ id, name, percentage, amount }) => (
          <TableRow key={id}>
            <TableCell className='font-medium'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className='max-w-[400px] truncate'>
                    {formatFirstLetterToUppercase(name)}
                  </TooltipTrigger>
                  <TooltipContent className='max-W-[400px] border bg-neutral-100 text-black shadow-lg'>
                    {formatFirstLetterToUppercase(name)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <PercentageBarCell value={percentage * 100} />
            <TableCell className='text-right'>{formatAmount(percentage * 100)}</TableCell>
            <TableCell className='text-right'>{formatCompact(amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
