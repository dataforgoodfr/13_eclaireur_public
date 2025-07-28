'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Award, Building2, Euro, Users } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { AdvancedSearchCommunity } from '@/app/models/community';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useDataTable } from '@/hooks/use-data-table';
import { CommunityType } from '@/utils/types';
import { formatCompact, stringifyCommunityType } from '@/utils/utils';

import { CustomDataTableToolbar } from './CustomDataTableToolbar';
import { useTableContext } from './TableContext';

type AdvancedSearchDataTableProps = {
  communities: AdvancedSearchCommunity[];
  pageCount: number;
  isLoading?: boolean;
};

export function AdvancedSearchDataTable({ communities, pageCount, isLoading = false }: AdvancedSearchDataTableProps) {
  const tableContext = useTableContext();
  const { setTable } = tableContext || {};

  const columns = React.useMemo<ColumnDef<AdvancedSearchCommunity>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Sélectionner tout"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Sélectionner la ligne"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40, // Réduire la largeur de la colonne
      },
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
              {community.nom.toLowerCase().replace(/\b\w/g, (l, index, str) => {
                const word = str.slice(index).split(/\s/)[0];
                const lowerCaseWords = ['de', 'du', 'des', 'le', 'la', 'les', 'et', 'en', 'au', 'aux'];
                if (index > 0 && lowerCaseWords.includes(word.toLowerCase())) {
                  return l.toLowerCase();
                }
                return l.toUpperCase();
              })}
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
          <DataTableColumnHeader column={column} title="Budget Subventions (€)" />
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
          label: 'Budget Subventions',
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
          label: 'Score Marchés Publics',
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
    [isLoading]
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
    enableRowSelection: true,
  });

  // Mettre à jour le contexte avec la table
  React.useEffect(() => {
    if (setTable) {
      setTable(table);
      return () => setTable(null);
    }
  }, [table, setTable]);



  return (
    <div className="w-full space-y-2.5">
      <DataTable table={table}>
        <CustomDataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}