'use client';

import { useRouter } from 'next/navigation';

import { Button } from '#components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function GoBackHome() {
  const router = useRouter();
  function goHome() {
    router.push('/');
  }

  return (
    <Button
      variant='link'
      onClick={goHome}
      className='flex w-fit items-center justify-start gap-4 pl-0 text-lg font-medium'
    >
      <ArrowLeft /> <span className='max-md:hidden'>Retour</span>
    </Button>
  );
}
