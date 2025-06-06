'use client';

import { useEffect, useState } from 'react';

import Loading from '@/components/ui/Loading';
import { useMarchesPublicsByCPV2 } from '@/utils/hooks/useMarchesPublicsByCPV2';

import Treemap from '../../../../../components/DataViz/Treemap';
import { TreeData, TreeLeaf, YearOption } from '../../types/interface';
import { NoData } from '../NoData';
import { CHART_HEIGHT } from '../constants';

type MarchesPublicsSectorTreemapProps = {
  siren: string;
  year: YearOption;
};

const LIMIT_NUMBER_CATEGORIES = 50;

export default function MarchesPublicsSectorTreemap({
  siren,
  year,
}: MarchesPublicsSectorTreemapProps) {
  const [maxAmount, setmaxAmount] = useState<number | null>(null);

  function updatemaxAmount(value: number | null) {
    setmaxAmount(value);
  }

  const { data, isPending, isError } = useMarchesPublicsByCPV2(
    siren,
    year === 'All' ? null : year,
    { page: 1, limit: LIMIT_NUMBER_CATEGORIES },
    maxAmount,
  );

  // Reset le "zoom" lors du changement d'année
  useEffect(() => {
    setmaxAmount(null);
  }, [year]);

  if (isPending || isError) {
    return <Loading style={{ height: CHART_HEIGHT }} />;
  }

  if (data.length === 0) {
    return <NoData />;
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

  return (
    <Treemap data={treeData} isZoomActive={maxAmount !== null} handleClick={updatemaxAmount} />
  );
}
