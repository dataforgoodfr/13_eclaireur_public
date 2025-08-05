'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

export default function GoBack() {
  const router = useRouter();

  return (
    <button onClick={router.back} className="flex items-center gap-2 text-primary hover:text-primary/80">
      <ArrowLeft className="h-5 w-5" />
      <span className="hidden lg:inline">Retour</span>
    </button>
  );
}
