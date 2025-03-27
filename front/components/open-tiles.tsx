'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import maplibregl from 'maplibre-gl';
import type { MapGeoJSONFeature, MapLayerMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCommunities } from '@/utils/hooks/useCommunities';
import { Community } from '@/app/models/community';

type AdminType = 'region' | 'departement' | 'commune';



const apiKey = process.env.NEXT_PUBLIC_MAPTILES_API_KEY;

const FranceMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const regionsRef = useRef<Community[]>([]);
  const departementsRef = useRef<Community[]>([]);
  const communesRef = useRef<Community[]>([]);
  const router = useRouter();

  const { data: regionsData } = useCommunities({ filters: { type: 'REG', limit: 100 } });
  const { data: departementsData } = useCommunities({ filters: { type: 'DEP', limit: 500 } });

  // Merge useCommunities data with fetched admin data
  useEffect(() => {
    if (regionsData) regionsRef.current = regionsData;
    if (departementsData) departementsRef.current = departementsData;
  }, [regionsData, departementsData]);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/adminData'); // Fetch additional data
      const data = await res.json();
  
      // Ensure previous data isn't overwritten
      regionsRef.current = [...(regionsRef.current || []), ...(data.regions || [])];
      departementsRef.current = [...(departementsRef.current || []), ...(data.departements || [])];
      communesRef.current = [...(communesRef.current || []), ...(data.communes || [])];
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }
  };

  

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'absolute z-50 pointer-events-none bg-white text-sm text-gray-900 rounded-lg shadow-md px-3 py-2';
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

          // Log zoom level on zoom events
      map.on('zoom', () => {
        console.log('Current zoom level:', map.getZoom());
      });


      map.on('load', () => {
        map.addLayer({
          id: 'background',
          type: 'background',
          paint: { 'background-color': '#f9f9f9' },
        });

        map.addSource('statesData', {
          type: 'vector',
          url: `https://api.maptiler.com/tiles/countries/tiles.json?key=${apiKey}`,
        });

        const addLayer = (id: string, level: number, color: string, zoomRange: { minzoom: number; maxzoom: number }) => {
          map.addLayer({
            id,
            source: 'statesData',
            'source-layer': 'administrative',
            type: 'fill',
            minzoom: zoomRange.minzoom,
            maxzoom: zoomRange.maxzoom,
            filter: ['all', ['==', 'level', level], ['==', 'level_0', 'FR']],
            paint: { 'fill-color': color, 'fill-opacity': 0.85, 'fill-outline-color': '#000' },
          });
        };

        addLayer('regions', 1, 'green', { minzoom: 0, maxzoom: 6 });
        addLayer('departements', 2, 'red', { minzoom: 6, maxzoom: 8 });
        addLayer('communes', 3, 'blue', { minzoom: 8, maxzoom: 14 });
        // addLayer('regionsBorder', 1, 'transparent', {minzoom: 6, maxzoom: 8})

        map.addLayer({
          id: 'region-borders',
          source: 'statesData',
          'source-layer': 'administrative',
          type: 'line',
          minzoom: 6, // Only visible when zoomed into departments
          maxzoom: 14,
          filter: ['all', ['==', 'level', 1], ['==', 'level_0', 'FR']],
          paint: {
            'line-color': '#FF9800', // Different color for visibility
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              6, 2,   // At zoom level 7, line width is 2
              10, 2 // At zoom level 10, line width is 3.5
            ],
            'line-opacity': 1,
          },
        });

        map.addLayer({
          id: 'department-borders',
          source: 'statesData',
          'source-layer': 'administrative',
          type: 'line',
          minzoom: 8, // Only visible when zoomed into departments
          maxzoom: 14,
          filter: ['all', ['==', 'level', 2], ['==', 'level_0', 'FR']],
          paint: {
            'line-color': 'black', // Different color for visibility
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              6, 2,   // At zoom level 7, line width is 2
              10, 2 // At zoom level 10, line width is 3.5
            ],
            'line-opacity': 1,
          },
        });

        // Tooltip handling
        const showTooltip = (feature: MapGeoJSONFeature, e: MapLayerMouseEvent, type: AdminType) => {
          if (!tooltipRef.current) return;

          const props = feature.properties;
          const code = props.code?.toString() || props.insee || props.code_commune;
          let data;

          if (type === 'commune') data = communesRef.current.find((c) => c.code === code);
          else if (type === 'departement') data = departementsRef.current.find((d) => d.code === code || d.nom === props.name);
          else data = regionsRef.current.find((r) => r.code === code || r.nom === props.name);

          if (!data) {
            tooltipRef.current.innerHTML = `<div class="text-sm text-gray-600">Unknown ${type}</div>`;
            return;
          }

          tooltipRef.current.innerHTML = `
            <div class="font-semibold">${data.nom}</div>
            <div class="text-xs text-gray-700">Population: ${data.population?.toLocaleString() ?? 'N/A'}</div>
            <div class="text-xs text-gray-500">SIREN: ${data.siren ?? 'N/A'}</div>
            ${type === 'commune' ? `<div class="text-xs text-gray-500">Département: ${data.departement?.nom ?? 'N/A'}</div>` : ''}
            ${type !== 'region' ? `<div class="text-xs text-gray-500">Région: ${data.region?.nom ?? 'N/A'}</div>` : ''}
            <div class="text-xs text-gray-400">Code: ${data.code}</div>
          `;

          tooltipRef.current.style.left = `${e.originalEvent.pageX + 10}px`;
          tooltipRef.current.style.top = `${e.originalEvent.pageY + 10}px`;
          tooltipRef.current.style.display = 'block';
        };

        ['regions', 'departements', 'communes'].forEach((layerId) => {
          const type = layerId === 'regions' ? 'region' : layerId === 'departements' ? 'departement' : 'commune';

          map.on('mousemove', layerId, (e) => {
            map.getCanvas().style.cursor = 'pointer';
            const feature = e.features?.[0];
            if (feature) showTooltip(feature, e, type);
          });

          map.on('mouseleave', layerId, () => {
            map.getCanvas().style.cursor = '';
            if (tooltipRef.current) tooltipRef.current.style.display = 'none';
          });
        });
      });

      const handleMapClick = (e: MapLayerMouseEvent, type: AdminType) => {
        const feature = e.features?.[0];
        if (!feature) return;
      
        const code = feature.properties?.code?.toString() || feature.properties?.insee || feature.properties?.code_commune;
        let community;
      
        if (type === 'commune') {
          community = communesRef.current.find((c) => c.code === code);
        } else if (type === 'departement') {
          community = departementsRef.current.find((d) => d.code === code || d.nom === feature.properties?.name);
        } else {
          community = regionsRef.current.find((r) => r.code === code || r.nom === feature.properties?.name);
        }
      
        // Hide tooltip on click
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
      
        if (community?.siren) {
          router.push(`/community/${community.siren}`);
        }
      };
      
      // Apply click event to all layers
      ['regions', 'departements', 'communes'].forEach((layerId) => {
        const type = layerId === 'regions' ? 'region' : layerId === 'departements' ? 'departement' : 'commune';
        
        map.on('click', layerId, (e) => handleMapClick(e, type));
      });
      

      return () => { if (tooltipRef.current) tooltipRef.current.remove(); };
    });
  }, []);

  return <div ref={mapContainerRef} className='h-[800px] w-[800px] rounded-lg shadow-md' />;
};

export default FranceMap;
