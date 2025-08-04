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
      <div className='minh-[460px] bg-none object-cover relative'>
        <Image src="/eclaireur/eyes_left.svg" alt="Yeux" className='absolute hidden md:block h-8' style={{ left: '15%', top: '40%' }} width={54} height={36} />
        <Image src="/eclaireur/eyes_right.svg" alt="Yeux" className='absolute hidden md:block h-8' style={{ right: '15%', top: '20%' }} width={60} height={40} />
        <Image src="/eclaireur/eyes_right.svg" alt="Yeux" className='absolute hidden md:block h-6' style={{ right: '10%', top: '80%' }} width={42} height={28} />
        <div className='global-margin flex h-full items-center justify-center'>
          <div className='flex w-520 flex-col items-center justify-center'>
            <Image src="/eclaireur/mascotte_search.svg" alt="Logo" className='w-120 mt-10' width={120} height={120} />
            <div className='flex flex-col items-center justify-center m-4'>
              <h1 className='text-h1 text-h1-kanit text-center'>Votre collectivité est-elle</h1>
              <h1 className='text-h1 font-kanit-bold bg-gradient-fade text-center px-4'>transparente ?</h1>
            </div>
            <h2 className='mb-6 w-3/4 text-center text-xl font-semibold'>
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
    </main>
  );
}
