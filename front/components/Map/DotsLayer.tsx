import { Layer, Source } from 'react-map-gl/maplibre';

interface PopulationCircleLayerProps {
  id: string;
  data: GeoJSON.FeatureCollection;
  minzoom: number;
  maxzoom: number;
  populationRange: [number, number];
  circleColor?: string;
  minPopulationForRadius: number;
  maxPopulationForRadius: number;
  minRadius?: number; // optional, default 4
  maxRadius?: number; // optional, default 16
}

export default function DotsLayer({
  id,
  data,
  minzoom,
  maxzoom,
  populationRange,
  circleColor = '#1976d2',
  minPopulationForRadius,
  maxPopulationForRadius,
  minRadius = 4,
  maxRadius = 16,
}: PopulationCircleLayerProps) {
  if (!data?.features?.length) return null;

  return (
    <Source id={`${id}-source`} type='geojson' data={data}>
      <Layer
        id={`${id}-layer`}
        type='circle'
        minzoom={minzoom}
        maxzoom={maxzoom}
        filter={[
          'all',
          ['>=', ['get', 'population'], populationRange[0]],
          ['<=', ['get', 'population'], populationRange[1]],
        ]}
        paint={{
          // Bigger circle radius, scaled by population range:
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'population'],
            minPopulationForRadius,
            6, // Increased from 4 to 6 for min size
            maxPopulationForRadius,
            24, // Increased from 16 to 24 for max size
          ],

          // Fill color with transparency:
          'circle-color': 'rgba(25, 118, 210, 0.4)', // #1976d2 at ~40% opacity

          // Border stroke:
          'circle-stroke-width': 2,
          'circle-stroke-color': '#1976d2',
        }}
      />
    </Source>
  );
}
