'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import SearchBar from '../../components/SearchBar/SearchBar';

export default function HomePageHeader() {
  const router = useRouter();

  function navigateToCommunityPage(siren: string) {
    router.push(`/community/${siren}`);
  }

  return (
    <main className='global-border'>
      <div className='minh-[460px] relative bg-none object-cover'>
        <Image
          src='/eclaireur/eyes_left.svg'
          alt='Yeux'
          className='absolute hidden h-8 md:block'
          style={{ left: '15%', top: '40%' }}
          width={54}
          height={36}
        />
        <Image
          src='/eclaireur/eyes_right.svg'
          alt='Yeux'
          className='absolute hidden h-8 md:block'
          style={{ right: '15%', top: '20%' }}
          width={60}
          height={40}
        />
        <Image
          src='/eclaireur/eyes_right.svg'
          alt='Yeux'
          className='absolute hidden h-6 md:block'
          style={{ right: '10%', top: '80%' }}
          width={42}
          height={28}
        />
        <div className='global-margin flex h-full items-center justify-center'>
          <div className='w-520 flex flex-col items-center justify-center'>
            <Image
              src='/eclaireur/mascotte_search.svg'
              alt='Logo'
              className='w-120 mt-10'
              width={120}
              height={120}
            />
            <div className='m-4 flex flex-col items-center justify-center'>
              <h1 className='text-h1-kanit text-center text-h1'>Votre collectivité est-elle</h1>
              <h1 className='bg-gradient-fade px-4 text-center font-kanit-bold text-h1'>
                transparente ?
              </h1>
            </div>
            <h2 className='mb-6 w-3/4 text-center text-xl font-semibold'>
              Accédez aux données de dépenses publiques de votre commune, département ou région.
            </h2>
            <div className='mx-auto flex w-full min-w-[400] justify-center'>
              <SearchBar
                className='relative w-full md:w-96 lg:w-[32rem]'
                onSelect={({ siren }) => navigateToCommunityPage(siren)}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
