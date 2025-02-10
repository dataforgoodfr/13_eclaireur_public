"use client";

import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";

const FranceMap = () => {
  const layers = [
    // Regions layer
    new GeoJsonLayer({
      id: "regions",
      data: "/data/regions.json",
      filled: true,
      getFillColor: [160, 196, 255, 100], // Light blue fill
      getLineColor: [0, 0, 255, 255], // Dark blue border
      lineWidthMinPixels: 1,
      pickable: false, // No interactivity
    }),

    // Departments layer
    new GeoJsonLayer({
      id: "departements",
      data: "/data/departements.json",
      filled: false,
      getLineColor: [0, 0, 0, 255], // Black border
      lineWidthMinPixels: 0.5,
      pickable: false,
    }),

    // Communes layer (filtered for population > 3500)
    new GeoJsonLayer({
      id: "communes",
      data: "/data/communes.json",
      filled: false,
      getLineColor: [128, 128, 128, 100], // Gray
      lineWidthMinPixels: 0.2,
      pickable: false,
    }),
  ];

  return (
    <DeckGL
      initialViewState={{
        longitude: 2.5,
        latitude: 46.5,
        zoom: 5,
        pitch: 0,
        bearing: 0,
      }}
      controller={{ scrollZoom: true, dragPan: true, dragRotate: false }}
      layers={layers}
    />
  );
};

export default FranceMap;
