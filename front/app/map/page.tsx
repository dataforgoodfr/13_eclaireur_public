'use client';

import { useState } from 'react';

import FranceMap from '@/components/FranceMap';
import SelectCommunityType from '@/components/SelectCommunityType';
import { DataTable } from '@/utils/fetchers/constants';
import { useCommunities } from '@/utils/hooks/useCommunities';
import { CommunityType } from '@/utils/types';

export default function MapPage() {
  const [communityType, setCommunityType] = useState(CommunityType.Region);

  const { isLoading, data } = useCommunities({
    filters: { type: communityType, limit: 100, siren: undefined },
  });

  console.log({ data });

  return (
    <div className='flex flex-row'>
      <div>
        <a
          href={
            process.env.NEXT_PUBLIC_BASE_URL +
            `api/csv-stream?limit=10&table=${DataTable.Communities}&columns=type`
          }
          download='CSV download stream'
          target='_blank'
        >
          <button style={{ background: 'pink' }}>CSV download</button>
        </a>
        <SelectCommunityType onChange={setCommunityType} />
        {isLoading && 'Chargement...'}
      </div>
      <div className='min-h-screen'>
        <div style={{ width: 500, height: 500 }}>
          <FranceMap width={500} height={500} />
        </div>
      </div>
    </div>
  );
}
