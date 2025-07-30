'use client';

import { useRouter } from 'next/navigation';

import SearchBar from '../../components/SearchBar/SearchBar';

export default function HomePageHeader() {
  const router = useRouter();

  function navigateToCommunityPage(siren: string) {
    router.push(`/community/${siren}`);
  }

  return (
    <div className='h-[460px] bg-none object-cover relative'>
      <img src="/eclaireur/eyes_right.png" alt="Yeux" className='absolute hidden md:block h-8' style={{ left: '15%', top: '40%' }} />
      <img src="/eclaireur/eyes_left.png" alt="Yeux" className='absolute hidden md:block h-8' style={{ right: '15%', top: '20%' }} />
      <img src="/eclaireur/eyes_left.png" alt="Yeux" className='absolute hidden md:block h-6' style={{ right: '10%', top: '80%' }} />
      <div className='global-margin flex h-full items-center justify-center'>
        <div className='flex w-520 flex-col items-center justify-center'>
          <img src="/eclaireur/mascotte_search.png" alt="Logo" className='w-120 mt-10' />
          <div className='flex flex-col items-center justify-center m-4'>
            <h1 className='text-h1 font-kanit-bold text-primary text-center'>Votre collectivité est-elle</h1>
            <h1 className='text-h1 font-kanit-bold text-primary bg-gradient-fade text-center'>transparente ?</h1>
          </div>
          <h2 className='mb-6 w-3/4 text-center text-xl font-semibold text-primary'>
          Accédez aux données de dépenses publiques de votre commune, département ou région.
          </h2>
          <div className='mx-auto flex w-full min-w-[400] justify-center'>
            <SearchBar
              className="relative w-full md:w-96 lg:w-[32rem]"
              onSelect={({ siren }) => navigateToCommunityPage(siren)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
