'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

export default function FicheGoBack() {
  const router = useRouter();

  return (
    <button onClick={router.back}>
      <ArrowLeft />
    </button>
  );
}
