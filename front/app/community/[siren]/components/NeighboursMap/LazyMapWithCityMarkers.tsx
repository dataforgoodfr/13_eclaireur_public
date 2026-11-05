'use client';

import dynamic from 'next/dynamic';

// maplibre-gl is ~200 KB gzipped and needs `window`: load it in its own chunk, client-side only,
// so it no longer weighs on the first load of every community page.
const LazyMapWithCityMarkers = dynamic(() => import('./MapWithCityMarkers'), {
  ssr: false,
  loading: () => <div className='h-full w-full animate-pulse bg-gray-100' aria-hidden />,
});

export default LazyMapWithCityMarkers;
