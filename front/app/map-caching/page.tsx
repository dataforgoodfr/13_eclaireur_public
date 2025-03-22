'use client';

import { useState } from 'react';

import DeckGLMapComponent from '@/components/DeckGLMapComponent';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useGeoDataCaching } from '@/utils/hooks/useGeoDataCaching';
import { Loader2 } from 'lucide-react';

export default function MapPage() {
  // Layer visibility toggles
  const [showRegions, setShowRegions] = useState(true);
  const [showDepartments, setShowDepartments] = useState(true);
  const [showCommunes, setShowCommunes] = useState(true);

  // Use the custom hook for fetching and caching geo data
  const {
    regionsData,
    departmentsData,
    communesData,
    isLoadingRegions,
    isLoadingDepartments,
    isLoadingCommunes,
    error,
  } = useGeoDataCaching();

  // Determine if we're in the initial loading state
  const isLoadingBasic = isLoadingRegions || isLoadingDepartments;

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Interactive Map</h1>

      {error && (
        <div className='mb-4 rounded-md bg-destructive/15 p-4 text-destructive'>{error}</div>
      )}

      <div className='mb-4 flex flex-wrap items-center gap-6'>
        <div className='flex items-center space-x-2'>
          <Switch id='show-regions' checked={showRegions} onCheckedChange={setShowRegions} />
          <Label htmlFor='show-regions'>Regions</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <Switch
            id='show-departments'
            checked={showDepartments}
            onCheckedChange={setShowDepartments}
          />
          <Label htmlFor='show-departments'>Departments</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <Switch
            id='show-communes'
            checked={showCommunes}
            onCheckedChange={setShowCommunes}
            disabled={!communesData || isLoadingCommunes}
          />
          <Label htmlFor='show-communes'>Communes</Label>
        </div>

        {isLoadingCommunes && (
          <div className='flex items-center text-sm text-muted-foreground'>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Loading commune data... ({communesData ? 'Complete' : 'In progress'})
          </div>
        )}

        <div className='ml-auto text-sm text-muted-foreground'>
          {regionsData && `Regions: ${regionsData.features?.length}`} |
          {departmentsData && ` Departments: ${departmentsData.features?.length}`} |
          {communesData && ` Communes: ${communesData.features?.length}`}
        </div>
      </div>

      <div className='relative h-[600px] overflow-hidden rounded-lg border'>
        {isLoadingBasic ? (
          <div className='absolute inset-0 flex items-center justify-center bg-background/50'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading map data...</span>
          </div>
        ) : (
          <DeckGLMapComponent
            regionsData={showRegions ? regionsData : null}
            departmentsData={showDepartments ? departmentsData : null}
            communesData={showCommunes ? communesData : null}
          />
        )}
      </div>

      <div className='mt-4 text-sm text-muted-foreground'>
        <p>Zoom levels:</p>
        <ul className='list-disc pl-5'>
          <li>0-6.5: Regions visible</li>
          <li>5.5-9.5: Departments visible</li>
          <li>8+: Communes visible</li>
        </ul>
      </div>
    </div>
  );
}
