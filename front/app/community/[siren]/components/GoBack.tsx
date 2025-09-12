'use client';

import { useRouter } from 'next/navigation';

import { Button } from '#components/ui/button';
import { ArrowLeft } from 'lucide-react';

type GoBackProps = {
  siren?: string;
};

export default function GoBack({ siren }: GoBackProps = {}) {
  const router = useRouter();

  const handleClick = () => {
    if (siren) {
      router.push(`/community/${siren}`);
    } else {
      router.back();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={'link'}
      className='flex h-12 items-center gap-2 text-primary hover:text-primary/80'
    >
      <ArrowLeft className='h-12 w-6' />
      <span className='text-md hidden lg:inline'>Retour</span>
    </Button>
  );
}
