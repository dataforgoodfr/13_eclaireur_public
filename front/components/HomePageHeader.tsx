'use client';

import { useRouter } from 'next/navigation';

import SearchBar from './SearchBar/SearchBar';

export default function HomePageHeader() {
  const router = useRouter();

  function navigateToCommunityPage(siren: string) {
    router.push(`/community/${siren}`);
  }

  return (
    <div className='h-[600px] bg-homepage-header bg-cover bg-center object-cover'>
      <div className='global-margin flex h-full items-center justify-center drop-shadow-[0px_0px_20px_rgba(0,0,0,0.4)]'>
        <div className='flex h-72 w-4/5 flex-col items-center justify-center rounded-2xl bg-card-foreground1'>
          <h1 className='my-4 text-7xl font-bold text-white'>ÉCLAIREUR PUBLIC</h1>
          <h2 className='mb-6 w-3/4 text-center text-xl font-semibold'>
            La plateforme citoyenne pour rendre transparentes et accessibles les dépenses publiques
            des collectivités locales.
          </h2>
          <SearchBar onSelect={({ siren }) => navigateToCommunityPage(siren)} />
        </div>
      </div>
    </div>
  );
}
