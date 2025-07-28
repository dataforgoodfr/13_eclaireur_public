'use client';

import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Building2, Users, Euro, Award } from 'lucide-react';
import Link from 'next/link';

import { AdvancedSearchCommunity } from '@/app/models/community';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import { cn, formatCompact, stringifyCommunityType } from '@/utils/utils';
import { CommunityType } from '@/utils/types';

import { CustomDataTableToolbar } from './CustomDataTableToolbar';
import { useTableContext } from './TableContext';

type AdvancedSearchDataTableProps = {
  communities: AdvancedSearchCommunity[];
  pageCount: number;
  isLoading?: boolean;
};

export function AdvancedSearchDataTable({ communities, pageCount, isLoading = false }: AdvancedSearchDataTableProps) {
  const { setTable } = useTableContext();
  
  const columns = React.useMemo<ColumnDef<AdvancedSearchCommunity>[]>(
    () => [
      {
        id: 'nom',
        accessorKey: 'nom',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Collectivité" />
        ),
        cell: ({ row }) => {
          if (isLoading) {
            return <Skeleton className="h-4 w-full" />;
          }
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
          if (isLoading) {
            return <Skeleton className="h-4 w-full" />;
          }
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
          if (isLoading) {
            return <Skeleton className="h-4 w-full" />;
          }
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
          if (isLoading) {
            return <Skeleton className="h-4 w-full" />;
          }
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
          if (isLoading) {
            return <Skeleton className="h-4 w-full" />;
          }
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
          if (isLoading) {
            return <Skeleton className="h-4 w-full" />;
          }
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

  // Créer des données factices pour le skeleton pendant le chargement
  const skeletonData = React.useMemo(() => {
    if (!isLoading) return [];
    return Array.from({ length: 10 }, (_, index) => ({
      siren: `skeleton-${index}`,
      nom: `skeleton-${index}`,
      type: CommunityType.Commune,
      population: 0,
      subventions_budget: 0,
      mp_score: null,
      subventions_score: null,
      total_row_count: 0,
    } as AdvancedSearchCommunity));
  }, [isLoading]);

  const { table } = useDataTable({
    data: isLoading ? skeletonData : communities,
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
    manualSorting: false,
    manualFiltering: true,
    enableSorting: true,
  });

  // Mettre à jour le contexte avec la table
  React.useEffect(() => {
    setTable(table);
    return () => setTable(null);
  }, [table, setTable]);

  return (
    <div className="w-full space-y-2.5">
      <DataTable table={table}>
        <CustomDataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}