'use client';

import { useRouter } from 'next/navigation';

import { Community } from '#app/models/community';
import SearchBar from '#components/SearchBar/SearchBar';

export default function FicheSearchModal() {
  const router = useRouter();

  function handleSelect(option: Pick<Community, 'nom' | 'siren' | 'type' | 'code_postal'>) {
    router.push(`/community/${option.siren}`);
  }

  return (
    <div className='space-y-4'>
      <div className='text-sm text-muted-foreground'>
        Recherchez une collectivité pour consulter sa fiche
      </div>
      <SearchBar className='relative w-full' onSelect={handleSelect} />
    </div>
  );
}
