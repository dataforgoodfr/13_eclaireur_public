export const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILES_API_KEY;
export const MAX_FEATURES_LOAD = 5000;
export const DEFAULT_VIEW_STATE = {
  longitude: 2.2137,
  latitude: 46.2276,
  zoom: 5,
};

export const BASE_MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#f9f9f9' },
    },
  ],
  glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${MAPTILER_API_KEY}`,
};
