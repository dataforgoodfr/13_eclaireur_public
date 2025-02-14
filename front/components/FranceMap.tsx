'use client';

import { useCallback, useEffect, useState } from 'react';

import { MapViewState, PickingInfo, ViewStateChangeParameters } from '@deck.gl/core';
import { GeoJsonLayer, GeoJsonLayerProps } from '@deck.gl/layers';
import DeckGL, { DeckGLProps } from '@deck.gl/react';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { feature } from 'topojson-client';
import { Topology } from 'topojson-specification';

const URL_TOPOJSON =
  'https://static.data.gouv.fr/resources/contours-des-communes-de-france-simplifie-avec-regions-et-departement-doutre-mer-rapproches/20220219-094943/a-com2022-topo.json';

type GeoJsonProperties = {
  code: `${number}`;
  nom: string;
};

enum Level {
  Region = 'region',
  Departement = 'departement',
  Communes = 'communes',
}

type Color = [number, number, number, number];

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
function colorScale(code: number, divider: number): Color {
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

function createRegionsLayer(props?: Omit<GeoJsonLayerProps, 'id'>) {
  return new GeoJsonLayer<GeoJsonProperties>({
    id: 'regions',
    lineWidthMinPixels: 1.5,
    pickable: true,
    visible: true,
    getFillColor: (d) => colorScale(+d.properties.code, 1),
    getLineColor: black,
    ...props,
  });
}

function createDepartementsLayer(props?: Omit<GeoJsonLayerProps, 'id'>) {
  return new GeoJsonLayer<GeoJsonProperties>({
    id: 'departements',
    pickable: true,
    lineWidthMinPixels: 1,
    getFillColor: (d) => colorScale(+d.properties.code, 100),
    getLineColor: black,
    ...props,
  });
}

function createCommunesLayer(props?: Omit<GeoJsonLayerProps, 'id'>) {
  return new GeoJsonLayer<GeoJsonProperties>({
    id: 'communes',
    pickable: true,
    lineWidthMinPixels: 0.2,
    getLineWidth: 100,
    getFillColor: (d) => colorScale(+d.properties.code, 100000),
    getLineColor: black,
    ...props,
  });
}

async function fetchJson(url: string) {
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

async function fetchTopoJson() {
  return (await fetchJson(URL_TOPOJSON)) as Topology;
}

function useTopoJson() {
  const [data, setData] = useState<Topology>();

  useEffect(() => {
    fetchTopoJson().then(setData).catch(console.error);
  }, [setData]);

  return data;
}

export default function FranceMap() {
  const topoJson = useTopoJson();

  return topoJson === undefined ? 'loading' : <Map topoJson={topoJson} />;
}

type MapProps = {
  topoJson: Topology;
};

function Map({ topoJson }: MapProps) {
  const [level, setLevel] = useState<Level>(Level.Region);

  const geojsonCom = feature(topoJson, topoJson.objects.a_com2022) as FeatureCollection<
    Geometry,
    GeoJsonProperties
  >;
  const geojsonDep = feature(topoJson, topoJson.objects.a_dep2022) as FeatureCollection<
    Geometry,
    GeoJsonProperties
  >;
  const geojsonReg = feature(topoJson, topoJson.objects.a_reg2022) as FeatureCollection<
    Geometry,
    GeoJsonProperties
  >;

  const layers = [
    createCommunesLayer({ data: geojsonCom.features, visible: level === Level.Communes }),
    createDepartementsLayer({ data: geojsonDep.features, filled: level === Level.Departement }),
    createRegionsLayer({ data: geojsonReg.features, filled: level === Level.Region }),
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
    <div style={{ height: '100%', width: '100%', position: 'relative', background: 'pink' }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        onViewStateChange={handleViewStateChange}
        controller={{ scrollZoom: true, dragPan: true, dragRotate: false }}
        layers={layers}
        getTooltip={getTooltip}
      />
    </div>
  );
}
