'use client';

import { useRouter } from 'next/navigation';

import SearchBar from '@/components/SearchBar/SearchBar';

export default function SearchCommunity({ className }: { className?: string }) {
  const router = useRouter();

  function navigateToCommunityPage({ siren }: { siren: string }) {
    if (siren) {
      router.push(`/community/${siren}`);
    }
  }

  return <SearchBar className={className} onSelect={navigateToCommunityPage} />;
}
