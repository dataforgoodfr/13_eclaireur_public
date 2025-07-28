'use client';

import { WithPagination } from '#components/Pagination';
import Loading from '#components/ui/Loading';
import { usePagination } from '#utils/hooks/usePagination';
import { useSubventionsByNaf } from '#utils/hooks/useSubventionsByNaf';
import { roundNumber } from '#utils/utils';

import { YearOption } from '../../types/interface';
import { NoData } from '../NoData';
import SectorTable, { SectorRow } from '../SectorTable/SectorTable';
import { CHART_HEIGHT } from '../constants';

type SubventionsSectorTableProps = {
  siren: string;
  year: YearOption;
};

const MAX_ROW_PER_PAGE = 10;

export default function SubventionsSectorTable({ siren, year }: SubventionsSectorTableProps) {
  const paginationProps = usePagination();

  const { data, isPending, isError } = useSubventionsByNaf(siren, year === 'All' ? null : year, {
    page: paginationProps.activePage,
    limit: MAX_ROW_PER_PAGE,
  });

  if (isPending || isError) {
    return <Loading style={{ height: CHART_HEIGHT }} />;
  }

  if (data.length === 0) {
    return <NoData />;
  }

  const rows: SectorRow[] = data.map(({ naf2, label, montant, grand_total }) => ({
    id: naf2,
    name: label,
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
