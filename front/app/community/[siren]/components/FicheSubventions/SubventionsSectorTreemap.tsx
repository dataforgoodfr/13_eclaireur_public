'use client';

import { useEffect, useState } from 'react';

import { useSubventionsByNaf } from '#utils/hooks/useSubventionsByNaf';

import Treemap from '../../../../../components/DataViz/Treemap';
import TreemapSkeleton from '../../../../../components/DataViz/TreemapSkeleton';
import { TreeData, TreeLeaf, YearOption } from '../../types/interface';
import EmptyState from '#components/EmptyState';

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
    return <TreemapSkeleton />;
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
