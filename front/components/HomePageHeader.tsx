'use client';

import { useRouter } from 'next/navigation';

import SearchBar from './SearchBar/SearchBar';

export default function HomePageHeader() {
  const router = useRouter();

  function navigateToCommunityPage(siren: string) {
    router.push(`/community/${siren}`);
  }

  return (
    <div className='h-[600px] bg-homepage-header bg-cover object-cover'>
      <div className='global-margin flex h-full flex-col items-center justify-center gap-y-12'>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-3xl font-semibold'>Éclaireur Public</h1>
          <h2 className='text-xl font-semibold'>Pour une transparence des dépenses</h2>
          <p className='text-base italic'>Dernière mise-à-jour: le 24 Février 2025</p>
        </div>
        <div className='flex h-72 w-3/5 flex-col items-center justify-center rounded-2xl border border-black bg-gray-500'>
          <h2 className='mb-6 w-3/4 text-center text-xl font-semibold'>
            Comment les dépenses publiques sont-elles réparties autour de chez vous ?
          </h2>
          <SearchBar onSelect={({ siren }) => navigateToCommunityPage(siren)} />
        </div>
      </div>
    </div>
  );
}
