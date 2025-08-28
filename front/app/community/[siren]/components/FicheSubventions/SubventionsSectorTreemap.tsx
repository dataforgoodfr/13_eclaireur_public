'use client';

import { useEffect, useState } from 'react';

import EmptyState from '#components/EmptyState';
import { useSubventionsByNaf } from '#utils/hooks/useSubventionsByNaf';

import Treemap from '../../../../../components/DataViz/Treemap';
import TreemapSkeleton from '../../../../../components/DataViz/TreemapSkeleton';
import type { TreeData, TreeLeaf, YearOption } from '../../types/interface';

type SubventionsSectorTreemapProps = {
  siren: string;
  year: YearOption;
};

const LIMIT_NUMBER_CATEGORIES = 50;

export default function SubventionsSectorTreemap({ siren, year }: SubventionsSectorTreemapProps) {
  const [maxAmount, setmaxAmount] = useState<number | null>(null);
  const [zoomStack, setZoomStack] = useState<(number | null)[]>([null]); // Start with overview

  const { data, isPending, isError } = useSubventionsByNaf(
    siren,
    year === 'All' ? null : year,
    { page: 1, limit: LIMIT_NUMBER_CATEGORIES },
    maxAmount,
  );

  function updatemaxAmount(value: number | null) {
    // Add current zoom level to stack before zooming in
    if (value !== null && value !== maxAmount) {
      setZoomStack((prev) => [...prev, maxAmount]);
    }
    setmaxAmount(value);
  }

  function handleZoomOut() {
    if (zoomStack.length > 1) {
      // Go back one level
      const newStack = [...zoomStack];
      newStack.pop(); // Remove current level
      const targetLevel = newStack[newStack.length - 1]; // Get previous level

      setZoomStack(newStack);
      setmaxAmount(targetLevel);
    }
  }

  // Reset le "zoom" lors du changement d'année
  useEffect(() => {
    setmaxAmount(null);
    setZoomStack([null]);
  }, [year]);

  if (isPending || isError) {
    return <TreemapSkeleton />;
  }
  if (data.length === 0) {
    return (
      <EmptyState
        title='Aucune donnée de subventions par secteur disponible'
        description="Il n'y a pas de données de subventions disponibles pour cette période. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés."
        siren={siren}
        className='h-[450px] w-full'
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
    <Treemap
      data={treeData}
      isZoomActive={maxAmount !== null}
      handleClick={updatemaxAmount}
      onZoomOut={zoomStack.length > 1 ? handleZoomOut : undefined}
      colorPalette='subventions'
      groupMode='value-based'
    />
  );
}
