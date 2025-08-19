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
import { usePagination } from '#utils/hooks/usePagination';
import { useSubventionPaginated } from '#utils/hooks/useSubventionPaginated';
import { formatAmount } from '#utils/utils';

import { YearOption } from '../../types/interface';
import { NoData } from '../NoData';
import MarchesPublicsTableSkeleton from '../Skeletons/MarchesPublicsTableSkeleton';
import { CHART_HEIGHT } from '../constants';

type SubventionTableProps = {
  siren: string;
  year: YearOption;
  paginationProps: ReturnType<typeof usePagination>;
};

const MAX_ROW_PER_PAGE = 10;

export default function SubventionsTable({ siren, year, paginationProps }: SubventionTableProps) {
  const { data, isPending, isError } = useSubventionPaginated(siren, year === 'All' ? null : year, {
    page: paginationProps.activePage,
    limit: MAX_ROW_PER_PAGE,
  });

  if (isPending || isError) {
    return (
      <div style={{ height: CHART_HEIGHT }}>
        <MarchesPublicsTableSkeleton rows={MAX_ROW_PER_PAGE} />
      </div>
    );
  }

  if (data.length === 0) {
    return <NoData />;
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

  const totalPage = Math.ceil(data[0].total_row_count / MAX_ROW_PER_PAGE);

  return (
    <WithPagination style={{ height: CHART_HEIGHT }} totalPage={totalPage} {...paginationProps}>
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
                <Badge key={name} className='m-1'>
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
