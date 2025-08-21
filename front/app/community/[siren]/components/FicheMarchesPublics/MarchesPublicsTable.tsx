'use client';

import { WithPagination } from '#components/Pagination';
import { Badge } from '#components/ui/badge';
import {
  Table as ShadCNTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table';
import { usePaginationState, usePaginationStateWithTotal } from '#hooks/usePaginationState';
import { useMarchesPublicsPaginated } from '#utils/hooks/useMarchesPublicsPaginated';
import { formatAmount } from '#utils/utils';

import EmptyState from '#components/EmptyState';
import { Skeleton } from '#components/ui/skeleton';
import { YearOption } from '../../types/interface';
import MarchesPublicsMobileSkeleton from '../Skeletons/MarchesPublicsMobileSkeleton';
import MarchesPublicsTableSkeleton from '../Skeletons/MarchesPublicsTableSkeleton';

type MarchesPublicsTableProps = {
  siren: string;
  year: YearOption;
};


const MAX_ROW_PER_PAGE = 10;
const MAX_ROW_PER_PAGE_MOBILE = 4;
const getItemsPerPage = () => (typeof window !== 'undefined' && window.innerWidth >= 768) ? MAX_ROW_PER_PAGE : MAX_ROW_PER_PAGE_MOBILE;

export default function MarchesPublicsTable({
  siren,
  year,
}: MarchesPublicsTableProps) {
  const itemsPerPage = getItemsPerPage();

  // First get initial pagination state
  const { currentPage } = usePaginationState('page_mp', 1);

  const { data, isPending, isError } = useMarchesPublicsPaginated(
    siren,
    year === 'All' ? null : year,
    {
      page: currentPage,
      limit: itemsPerPage,
    },
  );

  // Then use persistent pagination with the actual data
  const { totalPage } = usePaginationStateWithTotal(
    data,
    isPending,
    {
      paramName: 'page_mp',
      itemsPerPage: itemsPerPage,
    }
  );

  // Rendu du contenu selon l'état
  const renderContent = () => {
    if (isPending) {
      return (
        <>
          <MarchesPublicsTableSkeleton rows={itemsPerPage} />
          <MarchesPublicsMobileSkeleton rows={itemsPerPage} />
        </>
      );
    }

    if (isError) {
      return <div className="text-center text-red-500 p-4">Erreur lors du chargement</div>;
    }

    if (!data || data.length === 0) {
      return (
        <EmptyState
          title="Aucune donnée de marchés publics disponible"
          description="Il n'y a pas de données de marchés publics disponibles pour cette période. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés."
          siren={siren}
          className="h-[450px] w-full"
        />
      );
    }

    const rows: Row[] = data.map(({ id, titulaire_names, objet, montant, annee_notification }) => ({
      id,
      names: titulaire_names,
      object: objet,
      amount: montant,
      year: annee_notification,
    }));

    return <Table rows={rows} />;
  };

  return (
    <WithPagination
      className="min-h-[300px] w-full" // hauteur minimum responsive et pleine largeur
      totalPage={totalPage}
      urlParam="page_mp"
      mode="url"
    >
      {renderContent()}
    </WithPagination>
  );
}

type Row = {
  id: string | number;
  names: string[];
  object: string;
  amount: number;
  year: number;
};

type Table = {
  rows: Row[];
};

export function Table({ rows }: Table) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block w-full">
        <ShadCNTable>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[25%]'>Titulaire</TableHead>
              <TableHead className='w-[45%]'>Objet</TableHead>
              <TableHead className='w-[15%] text-right'>Montant (€)</TableHead>
              <TableHead className='w-[15%] text-right'>Année</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ id, names, object, amount, year }) => (
              <TableRow key={id}>
                <TableCell>
                  {names.map((name) => name ? (
                    <Badge key={name} className="bg-brand-2 text-primary rounded-full hover:bg-brand-2/80 m-1">
                      {name}
                    </Badge>
                  ) : null)}
                </TableCell>
                <TableCell>{object.toLocaleUpperCase()}</TableCell>
                <TableCell className='text-right'>{formatAmount(amount)}</TableCell>
                <TableCell className='text-right'>{year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ShadCNTable>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {rows.map(({ id, names, object, amount, year }, index) => (
          <div key={id}>
            {/* Vraie carte */}
            <div className="bg-muted-light rounded-lg p-4 w-full min-h-[200px]">
              {/* Titulaires badges */}
              <div className="flex flex-wrap gap-1 mb-2.5">
                {names.map((name) => name ? (
                  <Badge key={name} className="bg-brand-2 text-primary rounded-full hover:bg-brand-2/80">
                    {name}
                  </Badge>
                ) : null)}
              </div>

              {/* Objet/Title */}
              <h3 className="text-primary font-semibold text-base leading-tight line-clamp-2 mb-2.5">
                {object}
              </h3>

              {/* Ligne de séparation avant Montant */}
              <div className="border-b border-muted-border mb-2.5" />

              {/* Montant */}
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-muted text-sm">Montant</span>
                <span className="text-primary font-semibold text-lg">
                  {formatAmount(amount)}
                </span>
              </div>

              {/* Ligne de séparation avant Année */}
              <div className="border-b border-muted-border mb-2.5" />

              {/* Année */}
              <div className="flex justify-between items-center">
                <span className="text-muted text-sm">Année</span>
                <span className="text-primary font-medium">
                  {year}
                </span>
              </div>
            </div>

            {/* Skeleton pour debug (seulement sur la première carte) */}
            {index === 0 && (
              <div className="mt-3 bg-muted-light rounded-lg p-4 w-full min-h-[200px] border-2 border-red-500">
                <div className="text-red-500 text-xs mb-2">DEBUG SKELETON</div>
                {/* Badges skeleton */}
                <div className="flex flex-wrap gap-1 mb-2.5">
                  <Skeleton className='h-6 w-[80px] rounded-full' />
                  <Skeleton className='h-6 w-[60px] rounded-full' />
                </div>

                {/* Title skeleton */}
                <div className="mb-2.5">
                  <Skeleton className='h-4 w-full mb-2' />
                  <Skeleton className='h-4 w-3/4' />
                </div>

                {/* Separator */}
                <div className="border-b border-muted-border mb-2.5" />

                {/* Montant skeleton */}
                <div className="flex justify-between items-center mb-2.5">
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-5 w-24' />
                </div>

                {/* Separator */}
                <div className="border-b border-muted-border mb-2.5" />

                {/* Année skeleton */}
                <div className="flex justify-between items-center">
                  <Skeleton className='h-4 w-12' />
                  <Skeleton className='h-4 w-16' />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
