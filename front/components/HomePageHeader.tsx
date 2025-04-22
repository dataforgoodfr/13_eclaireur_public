'use client';

import { useRouter } from 'next/navigation';

import SearchBar from './SearchBar/SearchBar';

export default function HomePageHeader() {
  const router = useRouter();

  function navigateToCommunityPage(siren: string) {
    router.push(`/community/${siren}`);
  }

  return (
    <section className='h-[600px] bg-homepage-header bg-cover object-contain md:object-cover'>
      <div className='global-margin flex h-full flex-col items-center justify-center gap-y-12'>
        <div className='flex w-3/5 flex-col items-center justify-around gap-6 rounded-2xl bg-[#fdc04e] py-8 shadow-2xl'>
          <h1 className='text-center text-7xl font-bold uppercase text-[#ffeccf]'>
            Éclaireur Public
          </h1>
          <h2 className='w-3/4 text-center text-lg'>
            La première plateforme citoyenne pour rendre transparentes et accessibles les dépenses
            publiques des collectivités locales.
          </h2>
          <SearchBar onSelect={({ siren }) => navigateToCommunityPage(siren)} />
        </div>
      </div>
    </section>
  );
}
