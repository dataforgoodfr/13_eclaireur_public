'use client';

import EmptyState from '#components/EmptyState';
import { useMarchesPublicsByCPV2 } from '#utils/hooks/useMarchesPublicsByCPV2';
import { roundNumber } from '#utils/utils';

import type { YearOption } from '../../types/interface';
import SectorTable, { type SectorRow } from '../SectorTable/SectorTable';
import { CHART_HEIGHT } from '../constants';

type MarchesPublicsSectorTableProps = {
  siren: string;
  year: YearOption;
};

export default function MarchesPublicsSectorTable({ siren, year }: MarchesPublicsSectorTableProps) {
  const { data, isPending, isError } = useMarchesPublicsByCPV2(
    siren,
    year === 'All' ? null : year,
    {
      page: 1, // Start with page 1, TanStack Table will handle pagination internally
      limit: 1000, // Get more data to allow client-side pagination
    },
  );

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
        title='Aucune donnée de marchés publics par secteur disponible'
        description="Il n'y a pas de données de marchés publics disponibles pour cette période. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés."
        siren={siren}
        className='h-[450px] w-full'
      />
    );
  }

  // Transform data to table rows with unique IDs
  const rows: SectorRow[] = data.map(
    ({ cpv_2, cpv_2_label, objet, montant, grand_total }, index) => ({
      // Create a more unique ID using timestamp and random component
      id: `mp_${siren}_${cpv_2}_${index}_${montant}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: cpv_2_label,
      object: objet,
      amount: montant,
      percentage: roundNumber(montant / grand_total),
      type: 'marches-publics',
    }),
  );

  return (
    <div style={{ height: CHART_HEIGHT }}>
      <SectorTable data={rows} isLoading={isPending} />
    </div>
  );
}
