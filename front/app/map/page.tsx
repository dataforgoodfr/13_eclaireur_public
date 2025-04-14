'use client';

import { useState } from 'react';

import SelectCommunityType from '@/components/SelectCommunityType';
import { useCommunities } from '@/utils/hooks/useCommunities';
import { CommunityType } from '@/utils/types';

export default function MapPage() {
  const [communityType, setCommunityType] = useState(CommunityType.Region);

  const { isLoading, data } = useCommunities({
    filters: { type: communityType, siren: undefined },
    limit: 100,
  });

  console.log({ data });

  return (
    <div className='global-margin my-20 flex flex-row gap-x-10'>
      <div className='min-h-screen'>{/*  <FranceMap /> */}</div>
      <div>
        <SelectCommunityType onChange={setCommunityType} />
        {isLoading && 'Chargement...'}
      </div>
    </div>
  );
}
