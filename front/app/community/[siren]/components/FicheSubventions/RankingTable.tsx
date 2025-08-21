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
import { useSubventionPaginated } from '#utils/hooks/useSubventionPaginated';
import { formatAmount } from '#utils/utils';

import { YearOption } from '../../types/interface';
import EmptyState from '#components/EmptyState';
import MarchesPublicsTableSkeleton from '../Skeletons/MarchesPublicsTableSkeleton';
import { CHART_HEIGHT } from '../constants';

type SubventionTableProps = {
  siren: string;
  year: YearOption;
};

const MAX_ROW_PER_PAGE = 10;
const MAX_ROW_PER_PAGE_MOBILE = 4;
const getItemsPerPage = () => (typeof window !== 'undefined' && window.innerWidth >= 768) ? MAX_ROW_PER_PAGE : MAX_ROW_PER_PAGE_MOBILE;

export default function RankingTable({ siren, year }: SubventionTableProps) {
  const itemsPerPage = getItemsPerPage();
  
  // First get initial pagination state
  const { currentPage } = usePaginationState('page_subv_ranking', 1);

  const { data, isPending, isError } = useSubventionPaginated(siren, year === 'All' ? null : year, {
    page: currentPage,
    limit: itemsPerPage,
  });

  // Then use persistent pagination with the actual data
  const { totalPage } = usePaginationStateWithTotal(
    data,
    isPending,
    {
      paramName: 'page_subv_ranking',
      itemsPerPage: itemsPerPage,
    }
  );

  if (isPending || isError) {
    return (
      <div style={{ height: CHART_HEIGHT }}>
        <MarchesPublicsTableSkeleton rows={itemsPerPage} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="Aucun classement de subventions disponible"
        description="Il n'y a pas de données de subventions disponibles pour cette période. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés."
        siren={siren}
        className="h-[450px] w-full"
      />
    );
  }

  const rows: Row[] = data.map(
    ({ id_beneficiaire, beneficiaire_names, objet, montant, annee }) => ({
      id: id_beneficiaire,
      names: beneficiaire_names,
      object: objet,
      amount: montant,
      year: annee,
    }),
  );

  return (
    <WithPagination 
      style={{ height: CHART_HEIGHT }} 
      totalPage={totalPage} 
      urlParam="page_subv_ranking"
      mode="url"
    >
      <Table rows={rows} />
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
    <ShadCNTable>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[300px]'>Bénéficaire</TableHead>
          <TableHead className=''>Objet</TableHead>
          <TableHead className='w-[140px] text-right'>Montant (€)</TableHead>
          <TableHead className='w-[140px] text-right'>Année</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ id, names, object, amount, year }) => (
          <TableRow key={`${id}-${object}-${year}`}>
            <TableCell>
              {names.map((name) => (
                <Badge key={name} className="bg-brand-2 text-primary rounded-full hover:bg-brand-2/80 m-1">
                  {name}
                </Badge>
              ))}
            </TableCell>
            <TableCell>{object.toLocaleUpperCase()}</TableCell>
            <TableCell className='text-right'>{formatAmount(amount)}</TableCell>
            <TableCell className='text-right'>{year}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </ShadCNTable>
  );
}
