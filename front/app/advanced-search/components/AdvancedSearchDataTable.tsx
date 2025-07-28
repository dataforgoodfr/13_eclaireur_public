'use client';

import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Building2, Users, Euro, Award } from 'lucide-react';
import Link from 'next/link';

import { AdvancedSearchCommunity } from '@/app/models/community';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import { cn, formatCompact, stringifyCommunityType } from '@/utils/utils';

type AdvancedSearchDataTableProps = {
  communities: AdvancedSearchCommunity[];
  pageCount: number;
};

export function AdvancedSearchDataTable({ communities, pageCount }: AdvancedSearchDataTableProps) {
  const columns = React.useMemo<ColumnDef<AdvancedSearchCommunity>[]>(
    () => [
      {
        id: 'nom',
        accessorKey: 'nom',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Collectivité" />
        ),
        cell: ({ row }) => {
          const community = row.original;
          return (
            <Link 
              href={`/community/${community.siren}`}
              className="font-medium hover:underline"
            >
              {community.nom}
            </Link>
          );
        },
        meta: {
          label: 'Collectivité',
          icon: Building2,
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        id: 'type',
        accessorKey: 'type',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => {
          const type = row.getValue('type') as string;
          return (
            <div className="text-right">
              {stringifyCommunityType(type)}
            </div>
          );
        },
        meta: {
          label: 'Type',
        },
        enableSorting: true,
      },
      {
        id: 'population',
        accessorKey: 'population',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Population" />
        ),
        cell: ({ row }) => {
          const population = row.getValue('population') as number;
          return (
            <div className="text-right font-medium">
              {formatCompact(population)}
            </div>
          );
        },
        meta: {
          label: 'Population',
          icon: Users,
        },
        enableSorting: true,
      },
      {
        id: 'subventions_budget',
        accessorKey: 'subventions_budget',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Budget subventions (€)" />
        ),
        cell: ({ row }) => {
          const budget = row.getValue('subventions_budget') as number;
          return (
            <div className="flex items-center justify-end gap-1">
              <Euro className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{formatCompact(budget)}</span>
            </div>
          );
        },
        meta: {
          label: 'Budget subventions',
          icon: Euro,
        },
        enableSorting: true,
      },
      {
        id: 'mp_score',
        accessorKey: 'mp_score',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Score Marchés Publics" />
        ),
        cell: ({ row }) => {
          const score = row.getValue('mp_score') as string | null;
          if (!score) return <div className="text-right text-muted-foreground">-</div>;
          
          return (
            <div className="text-right">
              <Badge variant="outline" className="font-medium">
                <Award className="mr-1 h-3 w-3" />
                {score}
              </Badge>
            </div>
          );
        },
        meta: {
          label: 'Score MP',
          icon: Award,
        },
        enableSorting: true,
      },
      {
        id: 'subventions_score',
        accessorKey: 'subventions_score',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Score Subventions" />
        ),
        cell: ({ row }) => {
          const score = row.getValue('subventions_score') as string | null;
          if (!score) return <div className="text-right text-muted-foreground">-</div>;
          
          return (
            <div className="text-right">
              <Badge variant="outline" className="font-medium">
                <Award className="mr-1 h-3 w-3" />
                {score}
              </Badge>
            </div>
          );
        },
        meta: {
          label: 'Score Subventions',
          icon: Award,
        },
        enableSorting: true,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: communities,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: 'nom', desc: false }],
      columnVisibility: {
        subventions_budget: true,
        mp_score: true,
        subventions_score: true,
      },
    },
    getRowId: (row) => `${row.siren}-${row.type}`,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <div className="w-full space-y-2.5">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}