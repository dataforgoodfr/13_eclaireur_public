'use client';

import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCompact, formatFirstLetterToUppercase } from '@/utils/utils';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { SectorTablePagination } from './SectorTablePagination';

export type SectorRow = {
  id: string;
  name: string;
  object?: string;
  amount: number;
  /** Percentage from 0 to 1 */
  percentage: number;
  type?: 'marches-publics' | 'subventions';
};

type SectorTableProps = {
  data: SectorRow[];
  isLoading?: boolean;
};

export default function SectorTable({ data, isLoading = false }: SectorTableProps) {
  const columns = React.useMemo<ColumnDef<SectorRow>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => <div>Secteur</div>,
        cell: ({ row }) => {
          if (isLoading) {
            return <div className='h-5 w-[160px] animate-pulse rounded bg-gray-200' />;
          }
          const sectorRow = row.original;
          const textColorClass = sectorRow.type === 'subventions' ? 'text-brand-3' : 'text-primary';

          return (
            <div className={`font-medium ${textColorClass}`}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className='max-w-[200px] truncate'>
                    {formatFirstLetterToUppercase(sectorRow.name)}
                  </TooltipTrigger>
                  <TooltipContent className='max-w-[150px] border bg-neutral-100 text-black shadow-lg'>
                    {formatFirstLetterToUppercase(sectorRow.name)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: false,
        size: 200,
      },
      {
        id: 'object',
        accessorKey: 'object',
        header: () => <div>Objet</div>,
        cell: ({ row }) => {
          if (isLoading) {
            return <div className='h-5 w-[200px] animate-pulse rounded bg-gray-200' />;
          }
          const sectorRow = row.original;
          const textColorClass = sectorRow.type === 'subventions' ? 'text-brand-3' : 'text-primary';

          return (
            <div className={`font-medium ${textColorClass}`}>
              {sectorRow.object ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className='max-w-[220px] truncate'>
                      {sectorRow.object}
                    </TooltipTrigger>
                    <TooltipContent className='max-w-[500px] border bg-neutral-100 text-black shadow-lg'>
                      {sectorRow.object}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className='text-gray-400'>-</span>
              )}
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true,
        size: 150,
      },
      {
        id: 'percentage',
        accessorKey: 'percentage',
        header: () => <div className='text-right'>Part en %</div>,
        cell: ({ row }) => {
          if (isLoading) {
            return (
              <div className='flex items-center justify-end gap-2'>
                <div className='h-[14px] w-[300px] animate-pulse rounded-md bg-gray-200' />
                <div className='h-5 w-[40px] animate-pulse rounded bg-gray-200' />
              </div>
            );
          }
          const sectorRow = row.original;

          return (
            <div className='text-right'>
              <div className='flex items-center justify-end gap-2'>
                <div className='relative h-[14px] w-[300px] rounded-md border border-gray-300 bg-gray-100'>
                  <div
                    className={`h-[13px] rounded-sm transition-colors ${getSegmentedBarColor(sectorRow.percentage * 100, sectorRow.type)}`}
                    style={{ width: `${sectorRow.percentage * 100}%` }}
                  />
                </div>
                <span
                  className={`w-[40px] text-right font-semibold ${sectorRow.type === 'subventions' ? 'text-brand-3' : 'text-primary'}`}
                >
                  {Math.round(sectorRow.percentage * 100)}
                </span>
              </div>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: false,
        size: 400,
      },
      {
        id: 'amount',
        accessorKey: 'amount',
        header: () => <div className='text-right'>Montant (€)</div>,
        cell: ({ row }) => {
          if (isLoading) {
            return <div className='ml-auto h-5 w-24 animate-pulse rounded bg-gray-200' />;
          }
          const sectorRow = row.original;
          const textColorClass = sectorRow.type === 'subventions' ? 'text-brand-3' : 'text-primary';

          return (
            <div className={`text-right font-semibold ${textColorClass}`}>
              {formatCompact(sectorRow.amount)}
            </div>
          );
        },
        enableSorting: true,
        enableHiding: false,
        size: 120,
      },
    ],
    [isLoading],
  );

  // Helper function for percentage bar colors (moved from PercentageBarCell)
  const getSegmentedBarColor = (value: number, type?: 'marches-publics' | 'subventions') => {
    if (type === 'marches-publics') {
      // Primary colors divided by 20% segments
      if (value <= 20) return 'bg-primary-400';
      if (value <= 40) return 'bg-primary-500';
      if (value <= 60) return 'bg-primary-600';
      if (value <= 80) return 'bg-primary-600';
      return 'bg-primary-700';
    }
    // Subventions - using brand-3 variations
    if (value <= 20) return 'bg-brand-3/20';
    if (value <= 40) return 'bg-brand-3/40';
    if (value <= 60) return 'bg-brand-3/60';
    if (value <= 80) return 'bg-brand-3/80';
    return 'bg-brand-3';
  };

  // Create skeleton data for loading state
  const skeletonData = React.useMemo(() => {
    if (!isLoading) return [];
    return Array.from(
      { length: 10 },
      (_, index) =>
        ({
          id: `skeleton-${index}`,
          name: `skeleton-${index}`,
          object: 'skeleton',
          amount: 0,
          percentage: 0,
          type: 'marches-publics',
        }) as SectorRow,
    );
  }, [isLoading]);

  // For client-side pagination, we need to use useReactTable directly
  // since useDataTable is configured for server-side pagination
  const table = useReactTable({
    data: isLoading ? skeletonData : data,
    columns,
    initialState: {
      sorting: [{ id: 'amount', desc: true }], // Sort by amount descending by default
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    // Fix the getRowId to create truly unique IDs
    getRowId: (row, index) => {
      // Use index as fallback and combine with multiple fields for uniqueness
      const uniqueId = `${row.id}_${index}_${row.name}_${row.amount}`.replace(/\s+/g, '_');
      return uniqueId;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
    enableRowSelection: false, // No row selection needed for this table
    manualPagination: false, // Client-side pagination
    manualSorting: false, // Client-side sorting
  });

  return (
    <div className='w-full space-y-2.5'>
      <div className='overflow-hidden'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Aucune donnée disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <SectorTablePagination table={table} />
    </div>
  );
}
