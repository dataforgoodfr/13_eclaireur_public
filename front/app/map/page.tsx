'use client';

import { useState } from 'react';

import FranceMap from '@/components/FranceMap';
import SelectCommunityType from '@/components/SelectCommunityType';
import DownloadingButton from '@/components/ui/DownloadingButton';
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
        <DownloadingButton
          params={{
            table: DataTable.Communities,
            columns: ['type', 'nom'],
            limit: 1000,
            fileName: 'collectivites.csv',
          }}
        >
          Telecharger CSV
        </DownloadingButton>
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
