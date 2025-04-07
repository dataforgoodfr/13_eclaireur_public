'use client';

import { useState } from 'react';

import { MarchePublic } from '@/app/models/marche_public';
import * as d3 from 'd3';

type TreeNode = {
  type: 'node';
  value: number;
  name: string;
  children: Tree[];
};
type TreeLeaf = {
  type: 'leaf';
  name: string;
  value: number;
};

type Tree = TreeNode | TreeLeaf;

const data2: Tree = {
  type: 'node',
  name: 'boss',
  value: 0,
  children: [
    { type: 'leaf', name: 'Mark', value: 90 },
    { type: 'leaf', name: 'Robert', value: 12 },
    { type: 'leaf', name: 'Emily', value: 34 },
    { type: 'leaf', name: 'Marion', value: 53 },
    { type: 'leaf', name: 'Nicolas', value: 98 },
    { type: 'leaf', name: 'Malki', value: 22 },
    { type: 'leaf', name: 'Djé', value: 12 },
  ],
};

export default function Treemap({ data }: { data: MarchePublic[] }) {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    name: string;
    value: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    name: '',
    value: 0,
  });

  // const [selectedYear, setSelectedYear] = useState<YearOption>('All');
  // const availableYears: number[] = getAvailableYears(rawData);

  // const filteredData =
  //   selectedYear === 'All'
  //     ? rawData
  //     : rawData.filter((item) => item.datenotification_annee === selectedYear);

  // 1. Filtrer les données par année
  // 2. Calculer la somme des montants par secteur
  // 3. Trier les secteurs par somme par ordre décroissant
  // 4. Garder les 9 secteurs les plus importants
  // 5. Fusionner toutes les données restantes dans un seul objet "Autres"
  // 6. Fusionner ces deux objets pour créer un getTop10Sector
  // 7. Formatter la data pour le treemap

  function getTop10Sector(data: any[]) {
    const groupedData = data.reduce(
      (acc, { cpv_2_label, montant }) => {
        if (!acc[cpv_2_label]) {
          acc[cpv_2_label] = 0;
        }
        acc[cpv_2_label] += parseFloat(montant);
        return acc;
      },
      {} as Record<string, number>,
    );

    const sortedGroupedData = Object.entries(groupedData)
      .map(([name, size]) => ({ name, size }))
      .sort((a, b) => Number(b.size) - Number(a.size));

    const top10Sector =
      sortedGroupedData.length > 10 ? sortedGroupedData.slice(0, 10) : sortedGroupedData;
    const othersSectors =
      sortedGroupedData.length > 10
        ? {
            name: 'Autres',
            size: sortedGroupedData.slice(10).reduce((acc, item) => acc + Number(item.size), 0),
          }
        : { name: 'Autres', size: 0 };

    const top10SectorWithOthers = top10Sector.concat(othersSectors);

    const formattedData: Tree = {
      type: 'node',
      name: 'boss',
      value: 0,
      children: top10SectorWithOthers.map((item) => ({
        type: 'leaf',
        name: item.name,
        value: Number(item.size),
      })),
    };

    return formattedData;
  }

  console.log(getTop10Sector(data));
  const formattedData: Tree = getTop10Sector(data);

  const hierarchy = d3
    .hierarchy<Tree>(formattedData, (d) => (d.type === 'node' ? d.children : undefined))
    .sum((d) => d.value);

  const width = 1440;
  const height = 600;
  const treeGenerator = d3.treemap<Tree>().size([width, height]).padding(4);

  const root = treeGenerator(hierarchy);

  const allShapes = root.leaves().map((leaf) => {
    return (
      <g key={leaf.id}>
        <rect
          x={leaf.x0}
          y={leaf.y0}
          width={leaf.x1 - leaf.x0}
          height={leaf.y1 - leaf.y0}
          stroke='transparent'
          fill={'#69b3a2'}
          className='treemap-rect transition-all duration-300 ease-in-out opacity-80 hover:opacity-100'
          onMouseEnter={(e) => {
            setTooltip({
              visible: true,
              x: e.clientX + 0,
              y: e.clientY - 30,
              name: leaf.data.name,
              value: leaf.data.value,
            });
          }}
          onMouseMove={(e) => {
            setTooltip((prev) => ({
              ...prev,
              x: e.clientX + 0,
              y: e.clientY - 30,
            }));
          }}
          onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
        />
      </g>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        {allShapes}
      </svg>
      {tooltip.visible && (
        <div
          className='pointer-events-none fixed z-50 rounded bg-gray-900 px-3 py-2 text-sm text-white shadow-lg'
          style={{
            top: tooltip.y,
            left: tooltip.x,
            transform: 'translateY(-50%)',
          }}
        >
          <div className='font-bold'>{tooltip.name}</div>
          <div>{tooltip.value.toLocaleString()} €</div>
        </div>
      )}
    </div>
  );
}
