'use client';

import { useEffect, useRef, useState } from 'react';

import { formatCompactPrice, formatFirstLetterToUppercase } from '@/utils/utils';
import * as d3 from 'd3';

import { TooltipProps, TreeData } from '../../types/interface';
import { CHART_HEIGHT } from '../constants';
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
  const total = names.length;

  names.forEach((name, index) => {
    const lightness = Math.min(Math.round((80 / total) * index), 50);
    colorMap[name] = `hsl(0, 0%, ${lightness + 20}%)`;
  });

  return colorMap;
}

export default function Treemap({ data }: { data: TreeData }) {
  const [tooltip, setTooltip] = useState<TooltipProps>({
    visible: false,
    x: 0,
    y: 0,
    name: '',
    value: 0,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleOnMouseEnter(e: React.MouseEvent, leaf: d3.HierarchyRectangularNode<TreeData>) {
    console.log({ leaf });
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY - 30,
      name: leaf.data.name,
      value: leaf.data.value,
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
    <g key={leaf?.id ?? '' + leaf.data.name}>
      <rect
        x={leaf.x0}
        y={leaf.y0}
        rx={12}
        width={leaf.x1 - leaf.x0}
        height={leaf.y1 - leaf.y0}
        stroke='transparent'
        fill={colorMap[leaf.data.name]}
        className='transition-all duration-500 ease-in-out'
        onMouseEnter={(e) => handleOnMouseEnter(e, leaf)}
        onMouseMove={(e) => handleOnMouseMove(e)}
        onMouseLeave={() => handleOnMouseLeave()}
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
          {formatCompactPrice(leaf.data.value)}
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
          {wrapText(formatFirstLetterToUppercase(leaf.data.name), leaf.x1 - leaf.x0 - 16).map(
            (line, i) => (
              <tspan key={line} x={leaf.x0 + 8} dy={i === 0 ? 0 : 14}>
                {line}
              </tspan>
            ),
          )}
        </text>
      )}
    </g>
  ));

  return (
    <div ref={containerRef}>
      <svg width={width} height={height}>
        {allShapes}
      </svg>
      {tooltip.visible && <TreemapTooltip {...tooltip} />}
    </div>
  );
}
