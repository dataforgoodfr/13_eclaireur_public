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
import { useMarchesPublicsPaginated } from '#utils/hooks/useMarchesPublicsPaginated';
import { usePaginationState, usePaginationStateWithTotal } from '#hooks/usePaginationState';
import { formatAmount } from '#utils/utils';

import { YearOption } from '../../types/interface';
import { NoData } from '../NoData';
import { CHART_HEIGHT } from '../constants';
import MarchesPublicsTableSkeleton from '../Skeletons/MarchesPublicsTableSkeleton';

type MarchesPublicsTableProps = {
  siren: string;
  year: YearOption;
};

const MAX_ROW_PER_PAGE = 10;

export default function MarchesPublicsTable({
  siren,
  year,
}: MarchesPublicsTableProps) {
  // First get initial pagination state
  const { currentPage } = usePaginationState('page_mp', 1);

  const { data, isPending, isError } = useMarchesPublicsPaginated(
    siren,
    year === 'All' ? null : year,
    {
      page: currentPage,
      limit: MAX_ROW_PER_PAGE,
    },
  );

  // Then use persistent pagination with the actual data
  const { totalPage } = usePaginationStateWithTotal(
    data,
    isPending,
    {
      paramName: 'page_mp',
      itemsPerPage: MAX_ROW_PER_PAGE,
    }
  );

  // Rendu du contenu selon l'état
  const renderContent = () => {
    if (isPending) {
      return <MarchesPublicsTableSkeleton rows={MAX_ROW_PER_PAGE} />;
    }

    if (isError) {
      return <div className="text-center text-red-500 p-4">Erreur lors du chargement</div>;
    }

    if (!data || data.length === 0) {
      return <NoData />;
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
      style={{ height: CHART_HEIGHT }} 
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
    <ShadCNTable>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[300px]'>Titulaire</TableHead>
          <TableHead className=''>Objet</TableHead>
          <TableHead className='w-[140px] text-right'>Montant (€)</TableHead>
          <TableHead className='w-[140px] text-right'>Année</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ id, names, object, amount, year }) => (
          <TableRow key={id}>
            <TableCell>
              {names.map((name) => name ? (
                <Badge key={name} className='m-1'>
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
  );
}
