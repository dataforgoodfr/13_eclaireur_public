'use client';

import { useMemo, useRef, useState } from 'react';
import {
  Map as MapFromReactMapLibre,
  MapProps as MapPropsReactMapLibre,
  MapRef,
  Marker,
  Popup,
} from 'react-map-gl/maplibre';

import 'maplibre-gl/dist/maplibre-gl.css';

import Pin from './Pin';

const MAP_STYLE_URL = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const initialViewState: MapPropsReactMapLibre['initialViewState'] = {
  zoom: 10,
};

const style: React.CSSProperties = {
  width: 600,
  height: 400,
};

type Cities = {
  longitude: number;
  latitude: number;
  nom: string;
};

type MapWithCityMarkersProps = {
  center: [longitude: number, latitude: number];
  cities: Cities[];
};

export default function MapWithCityMarkers({ center, cities }: MapWithCityMarkersProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<Cities>();

  const markers = useMemo(
    () =>
      cities.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor='bottom'
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        >
          <Pin />
        </Marker>
      )),
    [],
  );

  return (
    <MapFromReactMapLibre
      ref={mapRef}
      initialViewState={{
        ...initialViewState,
        longitude: center[0],
        latitude: center[1],
      }}
      mapStyle={MAP_STYLE_URL}
      style={style}
    >
      {markers}
      {popupInfo && (
        <Popup
          anchor='top'
          longitude={Number(popupInfo.longitude)}
          latitude={Number(popupInfo.latitude)}
          onClose={() => setPopupInfo(undefined)}
        >
          <div>{popupInfo.nom}</div>
        </Popup>
      )}
    </MapFromReactMapLibre>
  );
}
