'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

export default function GoBackHome() {
  const router = useRouter();
  function goHome() {
    router.push('/');
  }

  return (
    <button onClick={goHome} className='flex w-fit items-center justify-start gap-4'>
      <ArrowLeft /> Retour
    </button>
  );
}
