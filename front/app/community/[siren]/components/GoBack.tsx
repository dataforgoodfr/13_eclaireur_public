'use client';

import { useRouter } from 'next/navigation';

import { Button } from '#components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function GoBack() {
  const router = useRouter();

  return (
    <Button
      onClick={router.back}
      variant={'link'}
      className='flex h-12 items-center gap-2 text-primary hover:text-primary/80'
    >
      <ArrowLeft className='h-12 w-6' />
      <span className='text-md hidden lg:inline'>Retour</span>
    </Button>
  );
}
