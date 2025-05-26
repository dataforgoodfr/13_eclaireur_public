export const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILES_API_KEY;

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
