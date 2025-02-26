'use client';

import { useState } from 'react';

import FranceMap from '@/components/FranceMap';
import SelectCommunityType from '@/components/SelectCommunityType';
import { CommunityType } from '@/utils/types';

export default function MapPage() {
  const [communityType, setCommunityType] = useState(CommunityType.Region);

  return (
    <div className='global-margin flex h-full flex-col items-center justify-center gap-y-12 bg-slate-500'>
      <SelectCommunityType onChange={setCommunityType} />
      {communityType}
      <div style={{ width: 500, height: 500, backgroundColor: 'red' }}>
        <FranceMap width={500} height={500} />
      </div>
    </div>
  );
}
