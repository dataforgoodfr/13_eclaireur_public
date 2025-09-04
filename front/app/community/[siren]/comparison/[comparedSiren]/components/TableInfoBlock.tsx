'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table';
import { formatCompactPrice } from '#utils/utils';

type TableInfoBlockProps = {
  totalAmount: number;
  totalNumber: number;
  top5Items: Array<{ label: string | null; value: number }> | null;
  comparisonName: string;
  columnLabel: string;
  communityName?: string;
  bgColor?: string;
  className?: string;
  isLoadingDetails?: boolean;
};

export function TableInfoBlock({
  totalAmount,
  totalNumber,
  top5Items,
  comparisonName,
  columnLabel,
  communityName,
  bgColor = 'bg-brand-3',
  className = '',
  isLoadingDetails = false,
}: TableInfoBlockProps) {
  return (
    <div className={className}>
      {communityName && (
        <div
          className={`mb-3 w-fit rounded-full ${bgColor} px-4 py-2 text-sm font-semibold text-primary`}
        >
          {communityName}
        </div>
      )}

      <div className='mb-2 hidden h-11 flex-row gap-4 md:block'>
        <h4 className='text-base text-primary'>
          Montant total{' '}
          <span
            className={`mx-4 rounded-full px-4 py-2 font-bold ${bgColor} ${isLoadingDetails ? 'animate-pulse' : ''}`}
          >
            {isLoadingDetails ? '---' : formatCompactPrice(totalAmount)}
          </span>
        </h4>
      </div>
      <div className='mb-8 hidden h-11 flex-row gap-4 md:block'>
        <h4 className='text-base text-primary'>
          Nombre de {comparisonName}
          <span
            className={`mx-4 rounded-full px-4 py-2 font-bold ${bgColor} ${isLoadingDetails ? 'animate-pulse' : ''}`}
          >
            {isLoadingDetails ? '---' : totalNumber}
          </span>
        </h4>
      </div>

      <div className='md:mx-5'>
        <Table className='text-xs sm:text-sm'>
          <TableCaption>Top 5 des {comparisonName}</TableCaption>
          <TableHeader>
            <TableRow className='hover:bg-gray-100 data-[state=selected]:bg-gray-100'>
              <TableHead className='text-left'>{columnLabel}</TableHead>
              <TableHead className='w-[75px] text-right'>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingDetails || !top5Items
              ? Array.from({ length: 5 }, (_, index) => (
                  <TableRow
                    key={`skeleton-row-${index.toString()}`}
                    className='animate-fadeIn hover:bg-gray-100 data-[state=selected]:bg-gray-100'
                  >
                    <TableCell className='text-left text-base text-primary'>
                      <div className='animate-pulse'>
                        <div
                          className={`h-4 rounded bg-gray-300 transition-all duration-300 ${
                            index === 0
                              ? 'w-32'
                              : index === 1
                                ? 'w-28'
                                : index === 2
                                  ? 'w-36'
                                  : index === 3
                                    ? 'w-24'
                                    : 'w-30'
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className='text-right text-base font-bold text-primary'>
                      <div className='flex justify-end'>
                        <div className='h-4 w-16 animate-pulse rounded bg-gray-300 transition-all duration-300' />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : top5Items.map(({ label, value }, index) => (
                  <TableRow
                    key={`${label || 'no-label'}-${index}`}
                    className='animate-fadeIn transition-all duration-300 hover:bg-gray-100 data-[state=selected]:bg-gray-100'
                  >
                    <TableCell className='text-left text-base text-primary'>
                      {label !== null
                        ? label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()
                        : 'Non précisé'}
                    </TableCell>
                    <TableCell className='text-right text-base font-bold text-primary'>
                      {formatCompactPrice(value)}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
