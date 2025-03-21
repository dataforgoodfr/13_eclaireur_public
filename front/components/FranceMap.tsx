'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useCommunities } from '@/utils/hooks/useCommunities';
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import {
  FlyToInterpolator,
  MapViewState,
  PickingInfo,
  ViewStateChangeParameters,
  WebMercatorViewport,
} from '@deck.gl/core';
import { GeoJsonLayer, GeoJsonLayerProps } from '@deck.gl/layers';
import DeckGL, { DeckGLProps } from '@deck.gl/react';
import { GeoPermissibleObjects, geoMercator, geoPath } from 'd3';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { feature } from 'topojson-client';
import { Topology } from 'topojson-specification';

const URL_TOPOJSON =
  'https://static.data.gouv.fr/resources/contours-des-communes-de-france-simplifie-avec-regions-et-departement-doutre-mer-rapproches/20220219-094943/a-com2022-topo.json';

type GeoJsonProperties = {
  /** nom */
  libgeo: string;
  /** commune code */
  codgeo: `${number}`;
  /** departement code */
  dep: `${number}`;
  /** region code */
  reg: `${number}`;
};

enum Level {
  Region = 'region',
  Departement = 'departement',
  Communes = 'communes',
}

type Color = [number, number, number, number];

const black: Color = [0, 0, 0, 255];

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 2,
  latitude: 46.5,
  zoom: 4,
  pitch: 0,
  bearing: 0,
  minZoom: 4,
  maxZoom: 10,
};

// TODO - Use D3 for scaling
/**
 * Color scale for testing
 */
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
    getFillColor: (d) => colorScale(+d.properties.reg, 100),
    getLineColor: black,
    ...props,
  });
}

function createDepartementsLayer(props?: Omit<GeoJsonLayerProps, 'id'>) {
  return new GeoJsonLayer<GeoJsonProperties>({
    id: 'departements',
    pickable: true,
    lineWidthMinPixels: 1,
    getFillColor: (d) => colorScale(+d.properties.dep, 100),
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
    getFillColor: (d) => colorScale(+d.properties.codgeo, 10000),
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

type FranceMapProps = Omit<MapProps, 'topoJson'>;

export default function FranceMap(props: FranceMapProps) {
  const topoJson = useTopoJson();

  return topoJson === undefined ? 'Chargement...' : <Map topoJson={topoJson} {...props} />;
}

type MapProps = {
  topoJson: Topology;
  height: number;
  width: number;
};

function Map({ topoJson, height, width }: MapProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [level, setLevel] = useState<Level>(Level.Region);
  const router = useRouter();

  const handleRegionClick = (siren: string) => {
    // Navigate to the community page with the given siren
    router.push(`/community/${siren}`);
  };

  const { isLoading, data } = useCommunities({
    filters: { type: 'REG', limit: 100, siren: undefined },
  });

  const geojsonCom = useMemo(
    () =>
      feature(topoJson, topoJson.objects.a_com2022) as FeatureCollection<
        Geometry,
        GeoJsonProperties
      >,
    [topoJson],
  );
  const geojsonDep = useMemo(
    () =>
      feature(topoJson, topoJson.objects.a_dep2022) as FeatureCollection<
        Geometry,
        GeoJsonProperties
      >,
    [topoJson],
  );
  const geojsonReg = useMemo(() => {
    if (!topoJson || !data) return []; // Return empty if no data or topoJson

    // Extract regions from topoJson
    const geoJson = feature(topoJson, topoJson.objects.a_reg2022) as FeatureCollection<
      Geometry,
      GeoJsonProperties
    >;

    // Merge community data into geojson features
    const mergedGeoJson = geoJson.features.map((geometry) => {
      const regionInfo = data.find((region) => region.cog === geometry.properties.reg); // Match by `reg` and `cog`
      return {
        ...geometry,
        properties: {
          ...geometry.properties,
          ...regionInfo, // Merge region info from `data` into the geometry's properties
        },
      };
    });

    return {
      ...geoJson,
      features: mergedGeoJson, // Use merged features
    };
  }, [topoJson, data]);

  function getObjectBoundingBox(
    object: GeoPermissibleObjects,
  ): [[number, number], [number, number]] {
    const projection = geoMercator();
    const path = geoPath(projection);

    const bbx = path.bounds(object);

    if (projection?.invert === undefined) {
      throw new Error('Projection invert fn should exist');
    }

    const topLeftCorner = projection.invert(bbx[0]);
    const bottomRightCorner = projection.invert(bbx[1]);

    if (!topLeftCorner || !bottomRightCorner) {
      throw new Error('Invalid projection inversion');
    }

    return [topLeftCorner, bottomRightCorner];
  }

  function zoomToShape(pickingInfo: PickingInfo) {
    const viewport = new WebMercatorViewport({ height, width });

    const bbx = getObjectBoundingBox(pickingInfo.object);

    const updatedViewState = viewport.fitBounds(bbx, { padding: 10 });

    setViewState({
      ...updatedViewState,
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: 'auto',
    });
  }

  const layers = [
    createCommunesLayer({
      data: geojsonCom.features,
      visible: level === Level.Communes,
      onClick: zoomToShape,
    }),
    createDepartementsLayer({
      data: geojsonDep.features,
      filled: level === Level.Departement,
      onClick: zoomToShape,
    }),
    createRegionsLayer({
      data: geojsonReg.features,
      filled: level === Level.Region,
      onClick: (info) => {
        // Access the `siren` property from the clicked region
        const siren = info.object.properties.siren;
        if (siren) {
          // Call the handleRegionClick function to navigate to the community page
          handleRegionClick(siren);
        }
      },
    }),
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
    setViewState(viewState);
  };

  function getTooltip({ object }: PickingInfo<Feature<Geometry, GeoJsonProperties>>) {
    if (object) {
      const regionName = object.properties.libgeo; // Display the region name (libgeo)
      const siren = object.properties.siren; // Example additional info (can be any field from the merged data)
      return (
        <div className='max-w-xs rounded bg-black p-4 font-sans text-white shadow-lg'>
          <h3 className='mb-2 text-lg font-semibold'>{regionName}</h3>
          <p>
            <span className='font-medium'>SIREN:</span> {siren}
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className='border-2 border-solid' style={{ position: 'relative', width, height }}>
      <DeckGL
        style={{ position: 'absolute' }}
        width={width}
        height={height}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={{ scrollZoom: true, dragPan: true, dragRotate: false }}
        layers={layers}
        getTooltip={getTooltip}
      />
    </div>
  );
}
