'use client';

import { Subvention } from '#app/models/subvention';
import { PaginationProps, WithPagination } from '#components/Pagination';
import { Badge } from '#components/ui/badge';
import {
  Table as ShadCNTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table';
import { formatAmount } from '#utils/utils';

import { YearOption } from '../../types/interface';
import { CHART_HEIGHT } from '../constants';
import { NoData } from '../NoData';

const ROWS_COUNT = 10;

interface RankingTableProps {
  data: Subvention[];
  year: YearOption;
  paginationProps: Omit<PaginationProps, 'totalPage'>;
}

export default function RankingTable({ data, year, paginationProps }: RankingTableProps) {
  const filteredData =
    year === 'All' ? data : data.filter((item) => String(item.annee) === String(year));

  function getShownSubs(data: Subvention[]) {
    const sortedSubs = data.sort((a, b) => Number(b.montant) - Number(a.montant));
    const subs = sortedSubs.slice(
      ROWS_COUNT * (paginationProps.activePage - 1),
      ROWS_COUNT * paginationProps.activePage,
    );

    return subs;
  }

  const totalPage = Math.ceil(filteredData.length / ROWS_COUNT);
  const rows = getShownSubs(filteredData);

  if (rows.length === 0) {
    return <NoData style={{ height: CHART_HEIGHT }} />;
  }

  return (
    <>
      <WithPagination style={{ height: CHART_HEIGHT }} totalPage={totalPage} {...paginationProps}>
        <Table rows={rows} />
      </WithPagination>
    </>
  );
}

function Table({ rows }: { rows: Subvention[] }) {
  function formatSubventionObject(input: string): string[] {
    return input
      .replace(/[\[\]]/g, '') // Supprime les crochets
      .replace(/\\r\\n|\r\n|\n/g, ' ') // Retire les \n\r
      .split(/',|",/) // Split sur des virgules
      .map((item) =>
        item
          .trim()
          .replace(/^['"]|['"]$/g, '')
          .toLocaleUpperCase(),
      );
  }

  return (
    <ShadCNTable>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[300px]'>Bénéficiaires</TableHead>
          <TableHead className=''>Objet</TableHead>
          <TableHead className='w-[140px] text-right'>Montant (€)</TableHead>
          <TableHead className='w-[140px] text-right'>Année</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((item, index) => (
          <TableRow key={index}>
            <TableCell className='font-medium'>
              { item.nom_beneficiaire ? <Badge className='m-1'>
                {item.nom_beneficiaire}
              </Badge> : null }
            </TableCell>
            <TableCell>
              {formatSubventionObject(item.objet).map((item, index) => (
                <span key={index}>
                  {index > 0 && ' - '}
                  {item}
                </span>
              ))}
            </TableCell>
            <TableCell className='text-right'>{formatAmount(item.montant)}</TableCell>
            <TableCell className='text-right'>{item.annee}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </ShadCNTable>
  );
}
