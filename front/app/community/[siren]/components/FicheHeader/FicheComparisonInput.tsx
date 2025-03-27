'use client';

import { Community } from '@/app/models/community';
import SearchBar from '@/components/SearchBar/SearchBar';

type FicheComparisonInput = { community: Community };

const searchLabel = 'Comparer avec une autre collectivité ?';

export function FicheComparisonInput({ community }: FicheComparisonInput) {
  return (
    <div className='flex flex-1 flex-col items-center gap-2'>
      <p>{searchLabel}</p>
      {/** TODO - Implement comparison */}
      <SearchBar onSelect={() => {}} />
    </div>
  );
}
