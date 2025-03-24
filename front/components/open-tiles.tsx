'use client';

import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { useCommunities } from '@/utils/hooks/useCommunities';
import maplibregl from 'maplibre-gl';
import type { MapGeoJSONFeature, MapLayerMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type AdminType = 'region' | 'departement' | 'commune';

interface Region {
  code: string;
  nom: string;
  population?: number;
  siren?: string;
}

interface Departement {
  code: string;
  nom: string;
  population?: number;
  siren?: string;
  region?: { code: string; nom: string };
}

interface Commune {
  code: string;
  nom: string;
  population?: number;
  siren?: string;
  departement?: { code: string; nom: string };
  region?: { code: string; nom: string };
}

const apiKey = process.env.NEXT_PUBLIC_MAPTILES_API_KEY;

const FranceMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const regionsRef = useRef<Region[]>([]);
  const departementsRef = useRef<Departement[]>([]);
  const communesRef = useRef<Commune[]>([]);
  const router = useRouter();

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/adminData'); // Option: Replace with direct API calls if needed
      const data = await res.json();
      regionsRef.current = data.regions;
      departementsRef.current = data.departements;
      communesRef.current = data.communes;
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const tooltip = document.createElement('div');
    tooltip.className =
      'absolute z-50 pointer-events-none bg-white text-sm text-gray-900 rounded-lg shadow-md px-3 py-2';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
    tooltipRef.current = tooltip;

    fetchAdminData().then(() => {
      const map = new maplibregl.Map({
        container: mapContainerRef.current!,
        style: {
          version: 8,
          sources: {},
          layers: [],
          glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${apiKey}`,
        },
        center: [2.2137, 46.2276],
        zoom: 5,
        maxZoom: 14,
      });

      map.on('load', () => {
        // Background
        map.addLayer({
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#f9f9f9',
          },
        });

        map.addSource('statesData', {
          type: 'vector',
          url: `https://api.maptiler.com/tiles/countries/tiles.json?key=${apiKey}`,
        });

        const layers = map.getStyle().layers || [];
        const firstSymbolId = layers.find((layer) => layer.type === 'symbol')?.id;

        // Layer helper
        const addLayer = (
          id: string,
          level: number,
          color: string,
          zoomRange: { minzoom: number; maxzoom: number },
        ) => {
          map.addLayer({
            id,
            source: 'statesData',
            'source-layer': 'administrative',
            type: 'fill',
            minzoom: zoomRange.minzoom,
            maxzoom: zoomRange.maxzoom,
            filter: ['all', ['==', 'level', level], ['==', 'level_0', 'FR']],
            paint: {
              'fill-color': color,
              'fill-opacity': 0.85,
              'fill-outline-color': '#000',
            },
          });
        };

        addLayer('regions', 1, 'green', { minzoom: 0, maxzoom: 7 });
        addLayer('departements', 2, 'red', { minzoom: 7, maxzoom: 10 });
        addLayer('communes', 3, 'blue', { minzoom: 10, maxzoom: 14 });

        // Tooltip logic
        const showTooltip = (
          feature: MapGeoJSONFeature,
          e: MapLayerMouseEvent,
          type: AdminType,
        ) => {
          if (!tooltipRef.current) return;

          const props = feature.properties;
          const code = props.code?.toString() || props.insee || props.code_commune;

          if (type === 'commune') {
            const data = communesRef.current.find((c) => c.code === code);
            if (!data) {
              tooltipRef.current.innerHTML = `<div class="text-sm text-gray-600">Unknown commune</div>`;
              return;
            }

            tooltipRef.current.innerHTML = `
              <div class="font-semibold">${data.nom}</div>
              <div class="text-xs text-gray-700">Population: ${data.population?.toLocaleString() ?? 'N/A'}</div>
              <div class="text-xs text-gray-500">Département: ${data.departement?.nom ?? 'N/A'}</div>
              <div class="text-xs text-gray-500">Région: ${data.region?.nom ?? 'N/A'}</div>
              <div class="text-xs text-gray-500">SIREN: ${data.siren ?? 'N/A'}</div>
              <div class="text-xs text-gray-400">Code: ${data.code}</div>
            `;
          } else if (type === 'departement') {
            const data = departementsRef.current.find(
              (d) => d.code === code || d.nom === props.name,
            );
            if (!data) {
              tooltipRef.current.innerHTML = `<div class="text-sm text-gray-600">Unknown département</div>`;
              return;
            }

            tooltipRef.current.innerHTML = `
              <div class="font-semibold">${data.nom}</div>
              <div class="text-xs text-gray-500">Région: ${data.region?.nom ?? 'N/A'}</div>
              <div class="text-xs text-gray-500">SIREN: ${data.siren ?? 'N/A'}</div>
              <div class="text-xs text-gray-400">Code: ${data.code}</div>
            `;
          } else if (type === 'region') {
            const data = regionsRef.current.find((r) => r.code === code || r.nom === props.name);
            if (!data) {
              tooltipRef.current.innerHTML = `<div class="text-sm text-gray-600">Unknown region</div>`;
              return;
            }

            tooltipRef.current.innerHTML = `
              <div class="font-semibold">${data.nom}</div>
              <div class="text-xs text-gray-500">SIREN: ${data.siren ?? 'N/A'}</div>
              <div class="text-xs text-gray-400">Code: ${data.code}</div>
            `;
          }

          tooltipRef.current.style.left = `${e.originalEvent.pageX + 10}px`;
          tooltipRef.current.style.top = `${e.originalEvent.pageY + 10}px`;
          tooltipRef.current.style.display = 'block';
        };

        ['regions', 'departements', 'communes'].forEach((layerId) => {
          const type =
            layerId === 'regions'
              ? 'region'
              : layerId === 'departements'
                ? 'departement'
                : 'commune';

          map.on('mousemove', layerId, (e) => {
            map.getCanvas().style.cursor = 'pointer';
            const feature = e.features?.[0];
            if (feature) {
              showTooltip(feature, e, type);
            }
          });

          map.on('mouseleave', layerId, () => {
            map.getCanvas().style.cursor = '';
            if (tooltipRef.current) tooltipRef.current.style.display = 'none';
          });
        });
      });

      map.on('click', 'communes', (e) => {
        const feature = e.features?.[0];
        const props = feature?.properties;

        if (!props) return;

        const code = props.code?.toString() || props.insee || props.code_commune;
        const commune = communesRef.current.find((c) => c.code === code);

        const siren = commune?.siren;

        if (siren) {
          router.push(`/community/${siren}`);
        } else {
          console.warn(`No SIREN found for commune ${props.name}`);
        }
      });

      return () => {
        if (tooltipRef.current) {
          tooltipRef.current.remove();
          tooltipRef.current = null;
        }
      };
    });
  }, []);

  return <div ref={mapContainerRef} className='h-[600px] w-full rounded-lg shadow-md' />;
};

export default FranceMap;
