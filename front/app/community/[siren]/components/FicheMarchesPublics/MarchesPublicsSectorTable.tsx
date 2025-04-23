'use client';

import Loading from '@/components/ui/Loading';
import { useTopMarchesPublicsBySector } from '@/utils/hooks/useTopMarchesPublics';
import { roundNumber } from '@/utils/utils';

import { YearOption } from '../../types/interface';
import SectorTable, { SectorRow } from './SectorTable';

type MarchesPublicsSectortableProps = {
  siren: string;
  year: YearOption;
};

export default function MarchesPublicsSectorTable({ siren, year }: MarchesPublicsSectortableProps) {
  const { data, isPending, isError } = useTopMarchesPublicsBySector(
    siren,
    year === 'All' ? null : year,
  );

  if (isPending || isError) {
    return <Loading />;
  }

  const rows: SectorRow[] = data.map(({ cpv_2, cpv_2_label, montant, grand_total }) => ({
    id: cpv_2,
    name: cpv_2_label,
    amount: montant,
    percentage: roundNumber(montant / grand_total),
  }));

  return <SectorTable data={rows} />;
}
