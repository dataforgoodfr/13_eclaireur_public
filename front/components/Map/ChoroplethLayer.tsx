import { Layer } from 'react-map-gl/maplibre';

import type { FilterSpecification } from 'maplibre-gl';

interface ChoroplethLayerProps {
  id: string;
  source: string; // <-- Add this
  sourceLayer: string;
  type?: 'fill' | 'line' | 'perspective';
  minzoom: number;
  maxzoom: number;
  filter: FilterSpecification;
  choroplethParameter: string;
  fillOpacity?: number;
  outlineColor?: string;
}

export default function ChoroplethLayer({
  id,
  source,
  sourceLayer,
  type = 'fill',
  minzoom,
  maxzoom,
  filter,
  choroplethParameter,
  fillOpacity = 0.85,
  outlineColor = '#000',
}: ChoroplethLayerProps) {
  if (type === 'fill') {
    return (
      <Layer
        id={id}
        source={source} // <-- Add this
        source-layer={sourceLayer}
        type='fill'
        minzoom={minzoom}
        maxzoom={maxzoom}
        filter={filter}
        paint={{
          'fill-color': [
            'interpolate',
            ['linear'],
            ['coalesce', ['feature-state', choroplethParameter], 5],
            1,
            '#79B381', // A - strong blue
            2,
            '#B2D675', // B - light blue
            3,
            '#FFDE8B', // C - soft teal
            4,
            '#FFA466', // D - soft yellow
            5,
            '#FF8574', // E - soft orange
          ],
          'fill-opacity': fillOpacity,
          'fill-outline-color': outlineColor,
        }}
      />
    );
  }
  // type === 'line'
  return (
    <Layer
      id={id}
      source={source} // <-- Add this
      source-layer={sourceLayer}
      type='line'
      minzoom={minzoom}
      maxzoom={maxzoom}
      filter={filter}
      paint={{
        'line-color': 'black',
        'line-width': ['interpolate', ['linear'], ['zoom'], 6, 2, 10, 2],
        'line-opacity': 1,
      }}
    />
  );
}
