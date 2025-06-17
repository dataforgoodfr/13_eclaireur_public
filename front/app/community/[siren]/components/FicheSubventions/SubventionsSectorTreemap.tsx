'use client';

import { useEffect, useState } from 'react';

import Loading from '@/components/ui/Loading';
import { useSubventionsByNaf } from '@/utils/hooks/useSubventionsByNaf';

import Treemap from '../../../../../components/DataViz/Treemap';
import { TreeData, TreeLeaf, YearOption } from '../../types/interface';
import { NoData } from '../NoData';
import { CHART_HEIGHT } from '../constants';

type SubventionsSectorTreemapProps = {
  siren: string;
  year: YearOption;
};

const LIMIT_NUMBER_CATEGORIES = 50;

export default function SubventionsSectorTreemap({ siren, year }: SubventionsSectorTreemapProps) {
  const [maxAmount, setmaxAmount] = useState<number | null>(null);
  const { data, isPending, isError } = useSubventionsByNaf(
    siren,
    year === 'All' ? null : year,
    { page: 1, limit: LIMIT_NUMBER_CATEGORIES },
    maxAmount,
  );

  function updatemaxAmount(value: number | null) {
    setmaxAmount(value);
  }

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

  const treeLeaves: TreeLeaf[] = data.map(({ naf2, label, montant, grand_total }) => ({
    type: 'leaf',
    id: naf2,
    name: label,
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
