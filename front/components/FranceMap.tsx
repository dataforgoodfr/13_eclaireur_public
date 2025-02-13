'use client';

import { useCallback, useState } from 'react';

import { Color, MapViewState, PickingInfo, ViewStateChangeParameters } from '@deck.gl/core';
import { GeoJsonLayer, GeoJsonLayerProps } from '@deck.gl/layers';
import DeckGL, { DeckGLProps } from '@deck.gl/react';
import type { Feature, Geometry } from 'geojson';

type GeoJsonProperties = {
  code: `${number}`;
  nom: string;
};

enum Level {
  Region = 'region',
  Departement = 'departement',
  Communes = 'communes',
}

const black: Color = [0, 0, 0, 255];

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 2.5,
  latitude: 46.5,
  zoom: 4,
  pitch: 0,
  bearing: 0,
  minZoom: 4,
  maxZoom: 10,
};

// TODO - Use D3 for scaling
function colorScale(code: number, divider: number): [number, number, number, number] {
  return [48, 128, (+code / divider) * 255, 255];
}

export function debounce<A = unknown, R = void>(
  fn: (args: A) => R,
  ms: number,
): (args: A) => Promise<R> {
  let timer: NodeJS.Timeout;

  return (args: A): Promise<R> =>
    new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        resolve(fn(args));
      }, ms);
    });
}

function createRegionsLayer(props?: Omit<GeoJsonLayerProps, 'id' | 'data'>) {
  return new GeoJsonLayer<GeoJsonProperties>({
    id: 'regions',
    data: '/data/regions.json',
    lineWidthMinPixels: 1.5,
    pickable: true,
    visible: true,
    getFillColor: (d) => colorScale(+d.properties.code, 1),
    getLineColor: black,
    ...props,
  });
}

function createDepartementsLayer(props?: Omit<GeoJsonLayerProps, 'id' | 'data'>) {
  return new GeoJsonLayer<GeoJsonProperties>({
    id: 'departements',
    data: '/data/departements.json',
    pickable: true,
    lineWidthMinPixels: 1,
    getFillColor: (d) => colorScale(+d.properties.code, 100),
    getLineColor: black,
    ...props,
  });
}

function createCommunesLayer(props?: Omit<GeoJsonLayerProps, 'id' | 'data'>) {
  return new GeoJsonLayer<GeoJsonProperties>({
    id: 'communes',
    // filtered for population > 3500
    data: '/data/communes.json',
    pickable: true,
    lineWidthMinPixels: 0.2,
    getLineWidth: 100,
    getFillColor: (d) => colorScale(+d.properties.code, 100000),
    getLineColor: black,
    ...props,
  });
}

export default function FranceMap() {
  const [level, setLevel] = useState<Level>(Level.Region);

  const layers = [
    createCommunesLayer({ visible: level === Level.Communes }),
    createDepartementsLayer({
      filled: level === Level.Departement,
    }),
    createRegionsLayer({ filled: level === Level.Region }),
  ];

  const handleDynamicLayers = debounce((viewState: ViewStateChangeParameters['viewState']) => {
    const thresholdCommunes = 7.2;
    const thresholdDepartements = 5;

    if (viewState.zoom < thresholdDepartements) {
      setLevel(Level.Region);
    } else if (viewState.zoom < thresholdCommunes) {
      setLevel(Level.Departement);
    } else {
      setLevel(Level.Communes);
    }
  }, 500);

  const handleViewStateChange: DeckGLProps['onViewStateChange'] = ({ viewState }) => {
    handleDynamicLayers(viewState);
  };

  const getTooltip = useCallback(
    ({ object }: PickingInfo<Feature<Geometry, GeoJsonProperties>>) => {
      return object ? object.properties.nom : null;
    },
    [],
  );

  return (
    <>
      <div style={{ height: '100%', width: '100%', position: 'relative', background: 'pink' }}>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          onViewStateChange={handleViewStateChange}
          controller={{ scrollZoom: true, dragPan: true, dragRotate: false }}
          layers={layers}
          getTooltip={getTooltip}
        />
      </div>
    </>
  );
}
