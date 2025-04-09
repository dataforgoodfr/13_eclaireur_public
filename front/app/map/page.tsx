'use client';

import { useState } from 'react';

import FranceMap from '@/components/Map/open-tiles';
import SelectCommunityType from '@/components/SelectCommunityType';
import { useCommunities } from '@/utils/hooks/useCommunities';
import { CommunityType } from '@/utils/types';

export default function MapPage() {
  const [communityType, setCommunityType] = useState(CommunityType.Region);

  const { isLoading, data } = useCommunities({
    filters: { type: communityType, limit: 100, siren: undefined },
  });

  console.log({ data });

  return (
    <div className='global-margin my-20 flex flex-row gap-x-10'>
      <div className='min-h-screen'>
        <FranceMap />
      </div>
      <div>
        <SelectCommunityType onChange={setCommunityType} />
        {isLoading && 'Chargement...'}
      </div>
    </div>
  );
}
