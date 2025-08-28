'use client';

import { useEffect, useRef, useState } from 'react';

import { formatCompactPrice, formatFirstLetterToUppercase } from '#utils/utils';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut } from 'lucide-react';

import { CHART_HEIGHT } from '../../app/community/[siren]/components/constants';
import type { TooltipProps, TreeData } from '../../app/community/[siren]/types/interface';
import { ActionButton } from '../ui/action-button';
import TreemapTooltip from './TreemapTooltip';

type ColorPalette = 'mp' | 'subventions';
type GroupMode = 'none' | 'gradient' | 'categorical' | 'value-based';

const COLOR_PALETTES = {
  mp: {
    colors: ['#ACC66C', '#C2DE7A', '#D7F787'],
    textDark: '#303F8D',
    textLight: '#303F8D',
  },
  subventions: {
    colors: ['#A2A8CA', '#B6BDE3', '#CAD2FC'],
    textDark: '#303F8D',
    textLight: '#303F8D',
  },
} as const;

// Generate gradient colors for a group using D3 sequential scale
function generateGradientColors(groupSize: number, baseColor: string): string[] {
  if (groupSize === 1) return [baseColor];

  // Create a sequential scale from light to the base color
  const colorScale = d3
    .scaleSequential()
    .domain([0, groupSize - 1])
    .interpolator(d3.interpolateRgb('#f0f0f0', baseColor));

  return Array.from({ length: groupSize }, (_, i) => colorScale(i));
}

// Calculate quantile thresholds for value-based grouping
function calculateValueGroups(leaves: d3.HierarchyRectangularNode<TreeData>[], numGroups = 4) {
  const values = leaves
    .map((leaf) => leaf.value || 0)
    .filter((value) => value > 0)
    .sort((a, b) => a - b);

  if (values.length === 0) return { thresholds: [], min: 0, max: 0 };

  const thresholds: number[] = [];
  for (let i = 1; i < numGroups; i++) {
    const index = Math.floor((values.length * i) / numGroups);
    thresholds.push(values[index]);
  }

  return {
    thresholds,
    min: values[0],
    max: values[values.length - 1],
  };
}

// Assign value group to a leaf node
function getValueGroup(value: number, thresholds: number[]): number {
  for (let i = 0; i < thresholds.length; i++) {
    if (value < thresholds[i]) return i;
  }
  return thresholds.length;
}

// Create intelligent color scale based on value group
function createValueBasedColor(groupIndex: number, palette: ColorPalette): string {
  const baseColors = COLOR_PALETTES[palette].colors;

  // Use the actual colors from the palette instead of generating gradients
  // Ensure we have enough colors, cycle if needed
  const colorIndex = Math.min(groupIndex, baseColors.length - 1);
  return baseColors[colorIndex];
}

// Get appropriate text color based on background color and palette
function getTextColor(backgroundColor: string, palette: ColorPalette): string {
  const paletteData = COLOR_PALETTES[palette];

  // Check if it's one of the darker colors (first 2 colors in palette)
  const darkColors = paletteData.colors.slice(0, 2) as readonly string[];
  const isDarkBackground = (darkColors as readonly string[]).includes(backgroundColor);

  return isDarkBackground ? paletteData.textLight : paletteData.textDark;
}

// Consolidate small items into a single "Autres" group
function consolidateSmallItemsFunction(
  data: TreeData,
  minThresholdPercent = 2,
  minItemsToConsolidate = 3,
): TreeData {
  if (data.type !== 'node' || !data.children) {
    return data;
  }

  const totalValue = data.children.reduce((sum, child) => sum + child.value, 0);
  const minThreshold = (totalValue * minThresholdPercent) / 100;

  const largeItems: TreeData[] = [];
  const smallItems: TreeData[] = [];

  for (const child of data.children) {
    if (child.value >= minThreshold) {
      largeItems.push(child);
    } else {
      smallItems.push(child);
    }
  }

  // Only consolidate if we have more than the specified minimum small items
  if (smallItems.length <= minItemsToConsolidate) {
    return data;
  }

  const consolidatedValue = smallItems.reduce((sum, item) => sum + item.value, 0);
  const consolidatedPercentage = smallItems.reduce(
    (sum, item) => sum + (item.type === 'leaf' ? item.part : 0),
    0,
  );

  const consolidatedItem: TreeData = {
    id: `${data.id}_autres`,
    name: `Autres (${smallItems.length} postes)`,
    value: consolidatedValue,
    type: 'leaf',
    part: consolidatedPercentage,
  };

  return {
    ...data,
    children: [...largeItems, consolidatedItem],
  };
}

function generateHierarchicalColorMap(
  root: d3.HierarchyRectangularNode<TreeData>,
  palette: ColorPalette = 'mp',
  groupMode: GroupMode = 'none',
): Record<string, string> {
  const colorMap: Record<string, string> = {};

  const baseColors = COLOR_PALETTES[palette].colors;

  if (groupMode === 'none') {
    // Original behavior - color leaves sequentially
    const leaves = root.leaves();
    leaves.forEach((leaf, index) => {
      const colorIndex = index % baseColors.length;
      colorMap[leaf.data.name] = baseColors[colorIndex];
    });
    return colorMap;
  }

  if (groupMode === 'value-based') {
    // NEW: Value-based intelligent grouping
    const leaves = root.leaves();
    const numGroups = 4;
    const { thresholds } = calculateValueGroups(leaves, numGroups);

    for (const leaf of leaves) {
      const value = leaf.value || 0;
      const groupIndex = getValueGroup(value, thresholds);
      colorMap[leaf.data.name] = createValueBasedColor(groupIndex, palette);
    }

    return colorMap;
  }

  // Hierarchical coloring - group by parent node
  let groupIndex = 0;

  // Process each group (children of root)
  for (const child of root.children || []) {
    const baseColor = baseColors[groupIndex % baseColors.length];
    const leaves = child.leaves();

    if (groupMode === 'gradient') {
      // Apply gradient within each group
      const gradientColors = generateGradientColors(leaves.length, baseColor);
      for (const [itemIndex, leaf] of leaves.entries()) {
        colorMap[leaf.data.name] = gradientColors[itemIndex];
      }
    } else if (groupMode === 'categorical') {
      // Same color for all items in group
      for (const leaf of leaves) {
        colorMap[leaf.data.name] = baseColor;
      }
    }

    groupIndex++;
  }

  return colorMap;
}

type TreemapProps = {
  data: TreeData;
  isZoomActive: boolean;
  handleClick: (value: number) => void;
  colorPalette?: ColorPalette;
  groupMode?: GroupMode;
  showZoomControls?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  consolidateSmallItems?: boolean;
  consolidationThreshold?: number;
  minItemsToConsolidate?: number;
};

export default function Treemap({
  data,
  isZoomActive,
  handleClick,
  colorPalette = 'mp',
  groupMode = 'none',
  showZoomControls = false,
  onZoomIn,
  onZoomOut,
  consolidateSmallItems = true,
  consolidationThreshold = 2,
  minItemsToConsolidate = 3,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ..._rest
}: TreemapProps) {
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

  // Apply small items consolidation before creating hierarchy
  const processedData = consolidateSmallItems
    ? consolidateSmallItemsFunction(data, consolidationThreshold, minItemsToConsolidate)
    : data;

  const hierarchy = d3
    .hierarchy<TreeData>(processedData, (d) => (d.type === 'node' ? d.children : undefined))
    .sum((d) => d.value);

  const treeGenerator = d3.treemap<TreeData>().size([width, height]).padding(4);
  const root = treeGenerator(hierarchy);

  const colorMap = generateHierarchicalColorMap(root, colorPalette, groupMode);

  // Check if zoom-in is possible (has clickable elements)
  const canZoomIn = root.leaves().some((leaf) => leaf.data.value > 0) && !isZoomActive;

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
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick(leaf.data.value);
          }
        }}
        tabIndex={0}
        role='button'
        aria-label={`${leaf.data.name}: ${formatCompactPrice(leaf.data.value)}`}
      />
      {leaf.x1 - leaf.x0 > 70 && leaf.y1 - leaf.y0 > 30 && (
        <text
          x={leaf.x0 + 8}
          y={leaf.y0 + 22}
          fontSize={16}
          fontWeight={700}
          fill={getTextColor(colorMap[leaf.data.name], colorPalette)}
          className='pointer-events-none'
        >
          {formatCompactPrice(leaf.data.value)}
        </text>
      )}
      {leaf.x1 - leaf.x0 > 80 && leaf.y1 - leaf.y0 > 60 && (
        <foreignObject
          x={leaf.x0 + 8}
          y={leaf.y0 + 38}
          width={leaf.x1 - leaf.x0 - 16}
          height={leaf.y1 - leaf.y0 - 46}
        >
          <div
            className='pointer-events-none truncate text-sm font-medium leading-tight'
            style={{
              color: getTextColor(colorMap[leaf.data.name], colorPalette),
            }}
          >
            {formatFirstLetterToUppercase(leaf.data.name)}
          </div>
        </foreignObject>
      )}
    </g>
  ));

  return (
    <div className='relative' ref={containerRef} style={{ height }}>
      {tooltip.visible && <TreemapTooltip {...tooltip} />}

      {/* Zoom-in icon - shown when zoom is possible (top-right) */}
      {canZoomIn && onZoomIn && (
        <ActionButton
          icon={<ZoomIn className='h-4 w-4' />}
          onClick={onZoomIn}
          className='absolute right-2 top-2 z-10'
          aria-label='Cliquer sur un élément pour zoomer'
        />
      )}

      {showZoomControls && (
        <div className='absolute left-2 top-2 z-10 flex flex-col gap-1'>
          {onZoomIn && (
            <ActionButton
              icon={<span className='text-lg font-bold'>+</span>}
              onClick={onZoomIn}
              aria-label='Zoom avant'
            />
          )}
          {onZoomOut && (
            <ActionButton
              icon={<span className='text-lg font-bold'>−</span>}
              onClick={onZoomOut}
              aria-label='Zoom arrière'
            />
          )}
        </div>
      )}

      <svg width={width} height={height}>
        {allShapes}
      </svg>

      {/* Zoom-out button - shown when zoomed in (bottom left) */}
      {isZoomActive && onZoomOut && (
        <ActionButton
          icon={<ZoomOut className='h-4 w-4' />}
          onClick={onZoomOut}
          className='absolute bottom-2 left-2 z-10 bg-primary text-white hover:bg-primary/90'
          aria-label="Revenir à l'affichage précédent"
        />
      )}
    </div>
  );
}
