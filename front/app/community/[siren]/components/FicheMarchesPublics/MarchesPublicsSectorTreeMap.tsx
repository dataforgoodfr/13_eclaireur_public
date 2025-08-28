'use client';

import { useEffect, useState } from 'react';

import EmptyState from '#components/EmptyState';
import { useMarchesPublicsByCPV2 } from '#utils/hooks/useMarchesPublicsByCPV2';

import Treemap from '../../../../../components/DataViz/Treemap';
import TreemapSkeleton from '../../../../../components/DataViz/TreemapSkeleton';
import type { TreeData, TreeLeaf, YearOption } from '../../types/interface';

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
  const [zoomStack, setZoomStack] = useState<(number | null)[]>([null]); // Start with overview

  function updatemaxAmount(value: number | null) {
    // Add current zoom level to stack before zooming in
    if (value !== null) {
      setZoomStack((prev) => [...prev, maxAmount]);
      setmaxAmount(value);
    }
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

  const { data, isPending, isError } = useMarchesPublicsByCPV2(
    siren,
    year === 'All' ? null : year,
    { page: 1, limit: LIMIT_NUMBER_CATEGORIES },
    maxAmount,
  );

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
        title='Aucune donnée de marchés publics par secteur disponible'
        description="Il n'y a pas de données de marchés publics disponibles pour cette période. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés."
        siren={siren}
        className='h-[450px] w-full'
      />
    );
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
    <Treemap
      data={treeData}
      isZoomActive={maxAmount !== null}
      handleClick={updatemaxAmount}
      onZoomOut={zoomStack.length > 1 ? handleZoomOut : undefined}
      colorPalette='mp'
      groupMode='value-based'
    />
  );
}
