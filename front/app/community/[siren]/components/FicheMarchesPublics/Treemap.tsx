'use client';

import { useEffect, useRef, useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { MarchePublic } from '@/app/models/marche_public';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber } from '@/utils/utils';
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

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] ?? '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = (currentLine + ' ' + word).length * 6.5; // Estimation ~6.5px par caractère
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function generateColorMap(names: string[]): Record<string, string> {
  const colorMap: Record<string, string> = {};
  const total = names.length;

  names.forEach((name, index) => {
    const hue = Math.round((360 / total) * index);
    colorMap[name] = `hsl(${hue}, 65%, 55%)`;
  });

  return colorMap;
}

type YearOption = number | 'All';

function getAvailableYears(data: MarchePublic[]) {
  return [...new Set(data.map((item) => item.datenotification_annee))].sort(
    (a: number, b: number) => a - b,
  );
}

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
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');
  const [containerWidth, setContainerWidth] = useState(0);
  const [tableDisplayed, setTableDisplayed] = useState(false);
  const [linesDisplayed, setLinesDisplayed] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    const observer = new ResizeObserver(resize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
      resize();
    }

    return () => observer.disconnect();
  }, []);

  const availableYears: number[] = getAvailableYears(data);

  const filteredData =
    selectedYear === 'All'
      ? data
      : data.filter((item) => item.datenotification_annee === selectedYear);

  function getTopSectors(data: any[]) {
    const groupedData = data.reduce(
      (acc, { cpv_2_label, montant }) => {
        if (!acc[cpv_2_label]) {
          acc[cpv_2_label] = 0;
        }
        acc[cpv_2_label] += parseFloat(String(montant));
        return acc;
      },
      {} as Record<string, number>,
    );

    const sortedGroupedData = Object.entries(groupedData)
      .map(([name, size]) => ({ name, size }))
      .sort((a, b) => Number(b.size) - Number(a.size));

    const total = data.reduce((acc, item) => acc + parseFloat(String(item.montant)), 0);
    const top1 = Number(sortedGroupedData.slice(0, 1)[0].size);

    const sortedGroupedDataPlusTotal = sortedGroupedData.map((item) => ({
      ...item,
      part: Math.round((Number(item.size) / total) * 100 * 10) / 10,
      pourcentageCategoryTop1: Math.round((Number(item.size) / top1) * 100 * 10) / 10,
    }));

    const topSectors =
      sortedGroupedDataPlusTotal.length > 10 + 10 * linesDisplayed
        ? sortedGroupedDataPlusTotal.slice(0, 10 + 10 * linesDisplayed)
        : sortedGroupedDataPlusTotal;

    // Pour calculer la catégories "Autres" - A garder pour le moment
    // const othersSectors =
    //   sortedGroupedDataPlusTotal.length > 10
    //     ? {
    //         name: 'Autres',
    //         size: sortedGroupedDataPlusTotal
    //           .slice(10)
    //           .reduce((acc, item) => acc + Number(item.size), 0),
    //       }
    //     : { name: 'Autres', size: 0 };

    // const top10SectorWithOthers = top10Sector.concat(othersSectors);

    const formattedData: Tree = {
      type: 'node',
      name: 'boss',
      value: 0,
      children: sortedGroupedData.map((item) => ({
        type: 'leaf',
        name: item.name,
        value: Number(item.size),
      })),
    };

    return [formattedData, topSectors];
  }

  const [formattedData, topSectors] = getTopSectors(filteredData) as [Tree, any[]];

  const height = 600;
  const width = containerWidth || 1486;

  const hierarchy = d3
    .hierarchy<Tree>(formattedData, (d) => (d.type === 'node' ? d.children : undefined))
    .sum((d) => d.value);

  const treeGenerator = d3.treemap<Tree>().size([width, height]).padding(4);
  const root = treeGenerator(hierarchy);

  const leafNames = root.leaves().map((leaf) => leaf.data.name);
  const colorMap = generateColorMap(leafNames);

  const allShapes = root.leaves().map((leaf) => (
    <g key={leaf.id}>
      <rect
        x={leaf.x0}
        y={leaf.y0}
        rx={12}
        width={leaf.x1 - leaf.x0}
        height={leaf.y1 - leaf.y0}
        stroke='transparent'
        fill={colorMap[leaf.data.name]}
        className='transition-all duration-500 ease-in-out'
        onMouseEnter={(e) => {
          setTooltip({
            visible: true,
            x: e.clientX,
            y: e.clientY - 30,
            name: leaf.data.name,
            value: leaf.data.value,
          });
        }}
        onMouseMove={(e) => {
          setTooltip((prev) => ({
            ...prev,
            x: e.clientX,
            y: e.clientY - 30,
          }));
        }}
        onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
      />
      {leaf.x1 - leaf.x0 > 70 && leaf.y1 - leaf.y0 > 30 && (
        <text
          x={leaf.x0 + 8}
          y={leaf.y0 + 22}
          fontSize={16}
          fontWeight={700}
          fill='white'
          className='pointer-events-none'
        >
          {formatNumber(leaf.data.value)}
        </text>
      )}
      {leaf.x1 - leaf.x0 > 80 && leaf.y1 - leaf.y0 > 60 && (
        <text
          x={leaf.x0 + 8}
          y={leaf.y0 + 42}
          fontSize={14}
          fontWeight={500}
          fill='white'
          className='pointer-events-none'
        >
          {wrapText(leaf.data.name, leaf.x1 - leaf.x0 - 16).map((line, i) => (
            <tspan key={i} x={leaf.x0 + 8} dy={i === 0 ? 0 : 14}>
              {line}
            </tspan>
          ))}
        </text>
      )}
    </g>
  ));

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Répartition </h3>
          <div className='flex items-baseline gap-2'>
            <div
              onClick={() => {
                setTableDisplayed(false);
                setLinesDisplayed(0);
              }}
              className={`cursor-pointer ${!tableDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              (graphique
            </div>{' '}
            <Switch
              checked={tableDisplayed}
              onCheckedChange={() => {
                setTableDisplayed((prev) => !prev);
                setLinesDisplayed(0);
              }}
            />
            <div
              onClick={() => {
                setTableDisplayed(true);
                setLinesDisplayed(0);
              }}
              className={`cursor-pointer ${tableDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              tableau)
            </div>{' '}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector years={availableYears} onSelect={setSelectedYear} />
          <DownloadSelector />
        </div>
      </div>
      {tableDisplayed && (
        <>
          <Table className='min-h-[600px]'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[400px]'>Secteur</TableHead>
                <TableHead className='w-[700px]'>Montant</TableHead>
                <TableHead className=''></TableHead>
                <TableHead className='text-right'>Part</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topSectors.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>{item.name}</TableCell>
                  <TableCell>
                    <div className='relative h-2 w-full rounded-md'>
                      <div
                        className='h-2 rounded-md bg-blue-500'
                        style={{ width: `${item.pourcentageCategoryTop1}%` }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell>{formatNumber(Number(item.size))}</TableCell>
                  <TableCell className='text-right'>{`${item.part}%`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {formattedData.type === 'node' &&
            formattedData.children &&
            formattedData.children.length > 10 + 10 * linesDisplayed && (
              <div className='flex items-center justify-center pt-6'>
                <button
                  className='rounded-md bg-neutral-600 px-3 py-1 text-neutral-100 hover:bg-neutral-800'
                  onClick={() => setLinesDisplayed(linesDisplayed + 1)}
                >
                  Voir plus
                </button>
              </div>
            )}
        </>
      )}
      {!tableDisplayed && (
        <div ref={containerRef}>
          <svg width={width} height={height}>
            {allShapes}
          </svg>
          {tooltip.visible && (
            <div
              className='pointer-events-none fixed z-50 max-w-[200px] rounded bg-gray-900 px-3 py-2 text-sm text-white shadow-lg'
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
      )}
    </>
  );
}
