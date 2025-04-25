'use client';

import { useState } from 'react';

import { PaginationProps, WithPagination } from '@/components/Pagination';
import Loading from '@/components/ui/Loading';
import { useMarchesPublicsByCPV2 } from '@/utils/hooks/useMarchesPublicsByCPV2';
import { roundNumber } from '@/utils/utils';

import { YearOption } from '../../types/interface';
import { NoData } from '../NoData';
import SectorTable, { SectorRow } from '../SectorTable/SectorTable';
import { CHART_HEIGHT } from '../constants';

type MarchesPublicsSectortableProps = {
  siren: string;
  year: YearOption;
};

const DEFAULT_PAGE = 1;

function usePagination(initialPage = DEFAULT_PAGE): Omit<PaginationProps, 'totalPage'> {
  const [page, setPage] = useState(initialPage);

  return {
    activePage: page,
    onPageChange: setPage,
  };
}

const MAX_ROW_PER_PAGE = 10;

export default function MarchesPublicsSectorTable({ siren, year }: MarchesPublicsSectortableProps) {
  const paginationProps = usePagination();

  const { data, isPending, isError } = useMarchesPublicsByCPV2(
    siren,
    year === 'All' ? null : year,
    {
      page: paginationProps.activePage,
      limit: MAX_ROW_PER_PAGE,
    },
  );

  if (isPending || isError) {
    return <Loading style={{ height: CHART_HEIGHT }} />;
  }

  if (data.length === 0) {
    return <NoData />;
  }

  const rows: SectorRow[] = data.map(({ cpv_2, cpv_2_label, montant, grand_total }) => ({
    id: cpv_2,
    name: cpv_2_label,
    amount: montant,
    percentage: roundNumber(montant / grand_total),
  }));

  const totalPage = Math.ceil(data[0].total_row_count / MAX_ROW_PER_PAGE);

  return (
    <WithPagination style={{ height: CHART_HEIGHT }} totalPage={totalPage} {...paginationProps}>
      <SectorTable data={rows} />
    </WithPagination>
  );
}
