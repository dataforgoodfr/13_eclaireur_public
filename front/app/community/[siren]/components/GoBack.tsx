'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

export default function GoBack() {
  const router = useRouter();

  return (
    <button onClick={router.back}>
      <ArrowLeft />
    </button>
  );
}
