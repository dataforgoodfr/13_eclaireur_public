'use client';

import { useEffect, useRef, useState } from 'react';

import { formatCompactPrice, formatFirstLetterToUppercase } from '#utils/utils';
import * as d3 from 'd3';

import { CHART_HEIGHT } from '../../app/community/[siren]/components/constants';
import { TooltipProps, TreeData } from '../../app/community/[siren]/types/interface';
import TreemapTooltip from './TreemapTooltip';

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

  // Colors from score-transparency palette (ordered from light to dark)
  const scoreTransparencyColors = [
    '#E8F787', // score-transparency-1 (vert clair)
    '#FAF79E', // score-transparency-3 (jaune très clair)
    '#CAD2FC', // score-transparency-2 (bleu clair)
    '#F4D93E', // score-transparency-4 (jaune)
    '#EE8100', // score-transparency-5 (orange foncé)
  ];

  names.forEach((name, index) => {
    const colorIndex = index % scoreTransparencyColors.length;
    colorMap[name] = scoreTransparencyColors[colorIndex];
  });

  return colorMap;
}

// TODO: fix linting error
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type TreemapProps = { data: TreeData; isZoomActive: boolean; handleClick: Function };

export default function Treemap({ data, isZoomActive, handleClick }: TreemapProps) {
  const [tooltip, setTooltip] = useState<TooltipProps>({
    visible: false,
    x: 0,
    y: 0,
    name: '',
    value: 0,
    percentage: 0,
  });
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  function handleOnMouseEnter(e: React.MouseEvent, leaf: d3.HierarchyRectangularNode<TreeData>) {
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY - 30,
      name: leaf.data.name,
      value: leaf.data.value,
      percentage: leaf.data.type === 'leaf' ? leaf.data.part : 0,
    });
  }

  function handleOnMouseMove(e: React.MouseEvent) {
    setTooltip((prev) => ({
      ...prev,
      x: e.clientX,
      y: e.clientY - 30,
    }));
  }

  function handleOnMouseLeave() {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }

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

  const height = CHART_HEIGHT;
  const width = containerWidth || 1486;

  const hierarchy = d3
    .hierarchy<TreeData>(data, (d) => (d.type === 'node' ? d.children : undefined))
    .sum((d) => d.value);

  const treeGenerator = d3.treemap<TreeData>().size([width, height]).padding(4);
  const root = treeGenerator(hierarchy);

  const leafNames = root.leaves().map((leaf) => leaf.data.name);
  const colorMap = generateColorMap(leafNames);

  const allShapes = root.leaves().map((leaf) => (
    <g key={leaf.data.id}>
      <path
        d={`
          M ${leaf.x0 + 8} ${leaf.y0}
          L ${leaf.x1} ${leaf.y0}
          L ${leaf.x1} ${leaf.y1 - 8}
          Q ${leaf.x1} ${leaf.y1} ${leaf.x1 - 8} ${leaf.y1}
          L ${leaf.x0} ${leaf.y1}
          L ${leaf.x0} ${leaf.y0 + 8}
          Q ${leaf.x0} ${leaf.y0} ${leaf.x0 + 8} ${leaf.y0}
          Z
        `}
        stroke='#303F8D'
        strokeWidth={1}
        fill={colorMap[leaf.data.name]}
        className='transition-all duration-500 ease-in-out'
        onMouseEnter={(e) => handleOnMouseEnter(e, leaf)}
        onMouseMove={(e) => handleOnMouseMove(e)}
        onMouseLeave={() => handleOnMouseLeave()}
        onClick={() => handleClick(leaf.data.value)}
      />
      {leaf.x1 - leaf.x0 > 70 && leaf.y1 - leaf.y0 > 30 && (
        <text
          x={leaf.x0 + 8}
          y={leaf.y0 + 22}
          fontSize={16}
          fontWeight={700}
          fill='#303F8D'
          className='pointer-events-none'
        >
          {formatCompactPrice(leaf.data.value)}
        </text>
      )}
      {leaf.x1 - leaf.x0 > 80 && leaf.y1 - leaf.y0 > 60 && (
        <text
          x={leaf.x0 + 8}
          y={leaf.y0 + 42}
          fontSize={14}
          fontWeight={500}
          fill='#303F8D'
          className='pointer-events-none'
        >
          {wrapText(formatFirstLetterToUppercase(leaf.data.name), leaf.x1 - leaf.x0 - 16).map(
            (line, i) => (
              <tspan key={line + i} x={leaf.x0 + 8} dy={i === 0 ? 0 : 14}>
                {line}
              </tspan>
            ),
          )}
        </text>
      )}
    </g>
  ));

  return (
    <div className='relative' ref={containerRef} style={{ height }}>
      {tooltip.visible && <TreemapTooltip {...tooltip} />}
      {isZoomActive && (
        <em className='ml-2'>
          Filtre actif: affichage limités aux montants inférieurs ou égaux à{' '}
          {formatCompactPrice(root.leaves()[0].value ?? 0)}
        </em>
      )}
      <svg width={width} height={height}>
        {allShapes}
      </svg>
    </div>
  );
}
