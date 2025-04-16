'use client';

import { useRouter } from 'next/navigation';

import { Community } from '@/app/models/community';
import SearchBar from '@/components/SearchBar/SearchBar';

type FicheComparisonInput = { community: Community };

const searchLabel = 'Comparer avec une autre collectivité ?';

export function FicheComparisonInput({ community }: FicheComparisonInput) {
  const router = useRouter();

  function goToComparison(comparedSiren: string) {
    router.push(`/community/${community.siren}/comparison/${comparedSiren}`);
  }

  return (
    <div className='flex flex-1 flex-col items-center gap-2'>
      <p>{searchLabel}</p>
      <SearchBar onSelect={(option) => goToComparison(option.siren)} />
    </div>
  );
}
