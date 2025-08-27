'use client';

import { WithPagination } from '#components/Pagination';
import { usePaginationState, usePaginationStateWithTotal } from '#hooks/usePaginationState';
import { useSubventionsByNaf } from '#utils/hooks/useSubventionsByNaf';
import { roundNumber } from '#utils/utils';

import { YearOption } from '../../types/interface';
import EmptyState from '#components/EmptyState';
import SectorTable, { SectorRow } from '../SectorTable/SectorTable';
import SectorTableSkeleton from '../Skeletons/SectorTableSkeleton';
import { CHART_HEIGHT } from '../constants';

type SubventionsSectorTableProps = {
  siren: string;
  year: YearOption;
};

const MAX_ROW_PER_PAGE = 10;

export default function SubventionsSectorTable({ siren, year }: SubventionsSectorTableProps) {
  // First get initial pagination state
  const { currentPage } = usePaginationState('page_subv_sector', 1);

  const { data, isPending, isError } = useSubventionsByNaf(siren, year === 'All' ? null : year, {
    page: currentPage,
    limit: MAX_ROW_PER_PAGE,
  });

  // Then use persistent pagination with the actual data
  const { totalPage } = usePaginationStateWithTotal(
    data,
    isPending,
    {
      paramName: 'page_subv_sector',
      itemsPerPage: MAX_ROW_PER_PAGE,
    }
  );

  // Rendu du contenu selon l'état
  const renderContent = () => {
    if (isPending || isError) {
      return (
        <div className="w-full self-stretch" style={{ height: CHART_HEIGHT }}>
          <SectorTableSkeleton rows={MAX_ROW_PER_PAGE} />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <EmptyState
          title="Aucune donnée de subventions par secteur disponible"
          description="Il n'y a pas de données de subventions disponibles pour cette période. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés."
          siren={siren}
          className="h-[450px] w-full"
        />
      );
    }

    const rows: SectorRow[] = data.map(({ naf2, label, montant, grand_total }) => ({
      id: naf2,
      name: label,
      amount: montant,
      percentage: roundNumber(montant / grand_total),
    }));

    return <SectorTable data={rows} />;
  };

  return (
    <WithPagination 
      style={{ height: CHART_HEIGHT }} 
      totalPage={totalPage} 
      urlParam="page_subv_sector"
      mode="url"
    >
      {renderContent()}
    </WithPagination>
  );
}
