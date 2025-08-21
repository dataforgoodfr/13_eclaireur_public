'use client';

import { WithPagination } from '#components/Pagination';
import { useMarchesPublicsByCPV2 } from '#utils/hooks/useMarchesPublicsByCPV2';
import { usePaginationState } from '#hooks/usePaginationState';
import { roundNumber } from '#utils/utils';

import { YearOption } from '../../types/interface';
import EmptyState from '#components/EmptyState';
import SectorTable, { SectorRow } from '../SectorTable/SectorTable';
import SectorTableSkeleton from '../Skeletons/SectorTableSkeleton';
import { CHART_HEIGHT } from '../constants';

type MarchesPublicsSectorTableProps = {
  siren: string;
  year: YearOption;
};

const MAX_ROW_PER_PAGE = 10;

export default function MarchesPublicsSectorTable({ siren, year }: MarchesPublicsSectorTableProps) {
  const { currentPage } = usePaginationState('page_mp_sector', 1);

  const { data, isPending, isError } = useMarchesPublicsByCPV2(
    siren,
    year === 'All' ? null : year,
    {
      page: currentPage,
      limit: MAX_ROW_PER_PAGE,
    },
  );

  if (isPending || isError) {
    return (
      <div style={{ height: CHART_HEIGHT }}>
        <SectorTableSkeleton rows={MAX_ROW_PER_PAGE} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="Aucune donnée de marchés publics par secteur disponible"
        description="Il n'y a pas de données de marchés publics disponibles pour cette période. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés."
        siren={siren}
        className="h-[450px] w-full"
      />
    );
  }

  const rows: SectorRow[] = data.map(({ cpv_2, cpv_2_label, montant, grand_total }) => ({
    id: cpv_2,
    name: cpv_2_label,
    amount: montant,
    percentage: roundNumber(montant / grand_total),
  }));

  const totalPage = Math.ceil(data[0].total_row_count / MAX_ROW_PER_PAGE);

  return (
    <WithPagination 
      style={{ height: CHART_HEIGHT }} 
      totalPage={totalPage} 
      urlParam="page_mp_sector"
      mode="url"
    >
      <SectorTable data={rows} />
    </WithPagination>
  );
}
