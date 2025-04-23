'use client';

import Loading from '@/components/ui/Loading';
import { useTopMarchesPublicsBySector } from '@/utils/hooks/useTopMarchesPublics';

import { TreeData, TreeLeaf, YearOption } from '../../types/interface';
import { CHART_HEIGHT } from '../constants';
import Treemap from './Treemap';

type MarchesPublicsSectorTreemapProps = {
  siren: string;
  year: YearOption;
};

export default function MarchesPublicsSectorTreemap({
  siren,
  year,
}: MarchesPublicsSectorTreemapProps) {
  const { data, isPending, isError } = useTopMarchesPublicsBySector(
    siren,
    year === 'All' ? null : year,
  );

  if (isPending || isError) {
    return <Loading style={{ height: CHART_HEIGHT }} />;
  }

  const treeLeaves: TreeLeaf[] = data.map(({ cpv_2, cpv_2_label, montant, grand_total }) => ({
    type: 'leaf',
    id: cpv_2,
    name: cpv_2_label,
    value: montant,
    part: montant / grand_total,
  }));

  const treeData: TreeData = {
    type: 'node',
    id: 'main-node',
    name: 'No children',
    value: 0,
    children: treeLeaves,
  };

  return <Treemap data={treeData} />;
}
