'use client';

import * as React from 'react';

import Link from 'next/link';

import { SCORE_INDICE_COLOR, TransparencyScore } from '#components/TransparencyScore/constants';
import { DataTablePagination } from '#components/data-table/data-table-pagination';
import { Separator } from '#components/ui/separator';
import { AdvancedSearchCommunity } from '@/app/models/community';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useDataTable } from '@/hooks/use-data-table';
import { CommunityType } from '@/utils/types';
import { cn, formatCompact, formatNomsPropres, stringifyCommunityType } from '@/utils/utils';
import { type ColumnDef } from '@tanstack/react-table';
import { Award, Building2, Euro, Users } from 'lucide-react';

import { CustomDataTableToolbar } from './CustomDataTableToolbar';
import { useTableContext } from './TableContext';

type AdvancedSearchDataTableProps = {
  communities: AdvancedSearchCommunity[];
  pageCount: number;
  isLoading?: boolean;
};

export function AdvancedSearchDataTable({
  communities,
  pageCount,
  isLoading = false,
}: AdvancedSearchDataTableProps) {
  const tableContext = useTableContext();
  const { setTable } = tableContext || {};

  const getBadgeScore = function (score: string | null) {
    if (!score) return <div className='text-right text-muted-foreground'>-</div>;
    const scoreBgClass = SCORE_INDICE_COLOR[score as TransparencyScore];
    return (
      <Badge
        variant='outline'
        className={cn('rounded-full px-3 py-1 text-base font-medium font-semibold', scoreBgClass)}
      >
        <Award className='mr-1 h-4 w-4' />
        {score}
      </Badge>
    );
  };

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
            aria-label='Sélectionner tout'
            className='translate-y-[2px]'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Sélectionner la ligne'
            className='translate-y-[2px]'
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40, // Réduire la largeur de la colonne
      },
      {
        id: 'nom',
        accessorKey: 'nom',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Collectivité' />,
        cell: ({ row }) => {
          if (isLoading) {
            return <Skeleton className='h-4 w-full' />;
          }
          const community = row.original;
          return (
            <Link href={`/community/${community.siren}`} className='font-medium hover:underline'>
              {formatNomsPropres(community.nom)}
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
        header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
        cell: ({ row }) => {
          if (isLoading) {
            return <Skeleton className='h-4 w-full' />;
          }
          const type = row.getValue('type') as CommunityType;
          return <div className='text-right'>{stringifyCommunityType(type)}</div>;
        },
        meta: {
          label: 'Type',
        },
        enableSorting: true,
      },
      {
        id: 'population',
        accessorKey: 'population',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Population' />,
        cell: ({ row }) => {
          if (isLoading) {
            return <Skeleton className='h-4 w-full' />;
          }
          const population = row.getValue('population') as number;
          return <div className='text-right font-medium'>{formatCompact(population)}</div>;
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
          <DataTableColumnHeader column={column} title='Budget Subventions (€)' />
        ),
        cell: ({ row }) => {
          if (isLoading) {
            return <Skeleton className='h-4 w-full' />;
          }
          const budget = row.getValue('subventions_budget') as number;
          return (
            <div className='flex items-center justify-end gap-1'>
              <span className='font-medium'>{formatCompact(budget)}</span>
              <Euro className='h-3 w-3 text-muted-foreground' />
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
          <DataTableColumnHeader column={column} title='Score Marchés Publics' />
        ),
        cell: ({ row }) => {
          if (isLoading) {
            return <Skeleton className='h-4 w-full' />;
          }
          const score = row.getValue('mp_score') as string | null;
          return <div className='pr-5 text-right'>{getBadgeScore(score)}</div>;
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
        header: ({ column }) => <DataTableColumnHeader column={column} title='Score Subventions' />,
        cell: ({ row }) => {
          if (isLoading) {
            return <Skeleton className='h-4 w-full' />;
          }
          const score = row.getValue('subventions_score') as string | null;
          return <div className='pr-5 text-right'>{getBadgeScore(score)}</div>;
        },
        meta: {
          label: 'Score Subventions',
          icon: Award,
        },
        enableSorting: true,
      },
    ],
    [isLoading],
  );

  // Créer des données factices pour le skeleton pendant le chargement
  const skeletonData = React.useMemo(() => {
    if (!isLoading) return [];
    return Array.from(
      { length: 10 },
      (_, index) =>
        ({
          siren: `skeleton-${index}`,
          nom: `skeleton-${index}`,
          type: CommunityType.Commune,
          population: 0,
          subventions_budget: 0,
          mp_score: null,
          subventions_score: null,
          total_row_count: 0,
        }) as AdvancedSearchCommunity,
    );
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
    getRowId: (row) => getItemId(row.siren, row.type),
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

  const getItemId = (siren: string, type: string) => {
    return `${siren}-${type}`;
  };

  return (
    <div className='w-full space-y-2.5'>
      <DataTable table={table} className='max-md:hidden'>
        <CustomDataTableToolbar table={table} />
      </DataTable>
      {/* Mobile Cards */}
      <div className='block space-y-3 px-5 md:hidden'>
        {communities.map(
          ({ siren, type, nom, population, subventions_budget, mp_score, subventions_score }) => (
            <div key={getItemId(siren, type)}>
              <div className='w-full space-y-3 rounded-lg bg-muted-border p-4'>
                {/* Nom de la collectivité */}
                <Badge className='rounded-full bg-brand-2 text-sm font-medium text-primary hover:bg-brand-2/80'>
                  {formatNomsPropres(nom)}
                </Badge>

                {/* Type de collectivité */}
                <h3 className='text-base font-bold leading-tight text-primary'>
                  {stringifyCommunityType(type as CommunityType)}
                </h3>

                <Separator className='bg-muted' />

                {/* Population */}
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-muted'>Population</span>
                  <span className='text-base text-muted'>{formatCompact(population)}</span>
                </div>

                <Separator className='bg-muted' />

                {/* Budget subventions */}
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-muted'>Budget subventions</span>
                  <div className='flex text-base font-bold text-primary'>
                    {formatCompact(subventions_budget)}
                    <Euro className='my-auto ms-1 h-4 w-4' strokeWidth={3} />
                  </div>
                </div>

                <Separator className='bg-muted' />

                {/* Score Marchés Publics */}
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-muted'>Score Marchés Publics</span>
                  <span className='font-medium text-primary'>{getBadgeScore(mp_score)}</span>
                </div>

                <Separator className='bg-muted' />

                {/* Score Subventions */}
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-muted'>Score Subventions</span>
                  <span className='font-medium text-primary'>
                    {getBadgeScore(subventions_score)}
                  </span>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
      <div className='flex flex-col gap-2.5 max-md:px-4'>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
