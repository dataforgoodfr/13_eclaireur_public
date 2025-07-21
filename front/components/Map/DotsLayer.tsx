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
  minRadius?: number; // optional, default 6
  maxRadius?: number; // optional, default 24
}

export default function DotsLayer({
  id,
  data,
  minzoom,
  maxzoom,
  populationRange,
  minPopulationForRadius,
  maxPopulationForRadius,
  minRadius = 6,
  maxRadius = 24,
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
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'population'],
            minPopulationForRadius,
            minRadius,
            maxPopulationForRadius,
            maxRadius,
          ],
          'circle-color': 'rgba(25, 118, 210, 0.4)',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#1976d2',
        }}
      />
    </Source>
  );
}
