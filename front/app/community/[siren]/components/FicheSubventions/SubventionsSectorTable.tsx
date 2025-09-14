'use client';

import EmptyState from '#components/EmptyState';
import { useSubventionsByNaf } from '#utils/hooks/useSubventionsByNaf';
import { roundNumber } from '#utils/utils';

import type { YearOption } from '../../types/interface';
import SectorTable, { type SectorRow } from '../SectorTable/SectorTable';
import { CHART_HEIGHT } from '../constants';

type SubventionsSectorTableProps = {
  siren: string;
  year: YearOption;
};

export default function SubventionsSectorTable({ siren, year }: SubventionsSectorTableProps) {
  const { data, isPending, isError } = useSubventionsByNaf(siren, year === 'All' ? null : year, {
    page: 1, // Start with page 1, TanStack Table will handle pagination internally
    limit: 1000, // Get more data to allow client-side pagination
  });

  // Show loading state
  if (isPending) {
    return (
      <div className='w-full self-stretch' style={{ height: CHART_HEIGHT }}>
        <SectorTable data={[]} isLoading={true} />
      </div>
    );
  }

  // Show error or empty state
  if (isError || data.length === 0) {
    return (
      <EmptyState
        title='Aucune donnée de subventions par secteur disponible'
        description="Il n'y a pas de données de subventions disponibles pour cette période. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés."
        siren={siren}
        className='h-[450px] w-full'
      />
    );
  }

  // Transform data to table rows
  const rows: SectorRow[] = data.map(({ naf2, label, objet, montant, grand_total }, index) => ({
    id: `${siren}-${naf2}-${index}-${objet?.substring(0, 10) || 'no-obj'}-${montant}`,
    name: label,
    object: objet,
    amount: montant,
    percentage: roundNumber(montant / grand_total),
    type: 'subventions',
  }));

  return (
    <div style={{ height: CHART_HEIGHT }}>
      <SectorTable data={rows} isLoading={isPending} />
    </div>
  );
}
