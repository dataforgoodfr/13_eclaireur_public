'use client';

import { useEffect, useRef, useState } from 'react';
import type { ViewState } from 'react-map-gl/maplibre';

import { Loader2, Search, X } from 'lucide-react';

import { MAPTILER_API_KEY } from './constants';

interface GeocodingFeature {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
}

interface GeocodingResponse {
  features: GeocodingFeature[];
}

interface FrenchGovFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    id?: string;
    citycode?: string;
    name?: string;
    city?: string;
    label: string;
  };
}

interface FrenchGovResponse {
  features: FrenchGovFeature[];
}

interface MapSearchProps {
  setViewState: (vs: Partial<ViewState>) => void;
}

export default function MapSearch({ setViewState }: MapSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Handle search with debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      console.log('[MapSearch] Searching for:', query);

      try {
        // Try MapTiler API first (removed restrictive types=place filter)
        const mapTilerUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_API_KEY}&country=fr&language=fr&limit=5`;
        console.log('[MapSearch] MapTiler API call:', mapTilerUrl);

        const response = await fetch(mapTilerUrl);

        if (!response.ok) {
          throw new Error('Erreur lors de la recherche MapTiler');
        }

        const data: GeocodingResponse = await response.json();
        console.log('[MapSearch] MapTiler response:', data);

        // Filter results to prioritize municipalities and places
        const filteredResults = data.features.filter((feature) =>
          feature.place_type.some((type) =>
            ['municipality', 'place', 'region', 'district'].includes(type),
          ),
        );

        // console.log("[MapSearch] Filtered results:", filteredResults);

        if (filteredResults.length > 0) {
          setResults(filteredResults);
          setShowResults(true);
        } else if (data.features.length > 0) {
          // If no municipalities/places found, show all results
          setResults(data.features.slice(0, 5));
          setShowResults(true);
        } else {
          // Try French government API as fallback
          // console.log(
          // 	"[MapSearch] No MapTiler results, trying French government API",
          // );
          await searchFrenchGovernmentAPI(query);
        }
      } catch (error) {
        console.error('[MapSearch] MapTiler API error:', error);
        // Try French government API as fallback
        try {
          await searchFrenchGovernmentAPI(query);
        } catch (fallbackError) {
          console.error('[MapSearch] French government API error:', fallbackError);
          setError('Impossible de rechercher ce lieu');
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Fallback to French government geocoding API
  const searchFrenchGovernmentAPI = async (searchQuery: string) => {
    const govUrl = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(searchQuery)}&type=municipality&limit=5`;
    // console.log("[MapSearch] French government API call:", govUrl);

    const response = await fetch(govUrl);

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche');
    }

    const data: FrenchGovResponse = await response.json();
    // console.log("[MapSearch] French government API response:", data);

    // Convert French government API format to MapTiler format
    const convertedFeatures: GeocodingFeature[] = data.features.map(
      (feature: FrenchGovFeature) => ({
        id: feature.properties.id || feature.properties.citycode || '',
        text: feature.properties.name || feature.properties.city || '',
        place_name: feature.properties.label,
        center: feature.geometry.coordinates,
        place_type: ['municipality'],
      }),
    );

    // console.log("[MapSearch] Converted features:", convertedFeatures);
    setResults(convertedFeatures);
    setShowResults(true);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultClick = (feature: GeocodingFeature) => {
    const [longitude, latitude] = feature.center;
    setViewState({
      longitude,
      latitude,
      zoom: 11,
    });
    setQuery('');
    setResults([]);
    setShowResults(false);
    // Note: Map's onMoveEnd will automatically trigger updateVisibleCodes when transition completes
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setError(null);
  };

  return (
    <div ref={searchRef} className='relative w-full'>
      <div className='relative'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <Search className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
          }}
          placeholder='Rechercher une ville...'
          className='block w-full rounded-tl-br border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary'
        />
        {isLoading && (
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
            <Loader2 className='h-5 w-5 animate-spin text-gray-400' />
          </div>
        )}
        {!isLoading && query && (
          <button
            type='button'
            onClick={handleClear}
            className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600'
          >
            <X className='h-5 w-5' />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && (results.length > 0 || error) && (
        <div className='absolute z-50 mt-1 w-full rounded-tl-br border border-gray-200 bg-white shadow-lg'>
          {error && <div className='px-4 py-3 text-sm text-red-600'>{error}</div>}
          {results.length > 0 && (
            <ul className='max-h-60 overflow-y-auto'>
              {results.map((feature) => (
                <li key={feature.id}>
                  <button
                    type='button'
                    onClick={() => handleResultClick(feature)}
                    className='w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none'
                  >
                    <div className='font-medium text-gray-900'>{feature.text}</div>
                    <div className='text-xs text-gray-500'>{feature.place_name}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!error && results.length === 0 && query.length >= 2 && !isLoading && (
            <div className='px-4 py-3 text-sm text-gray-500'>Aucun résultat trouvé</div>
          )}
        </div>
      )}
    </div>
  );
}
