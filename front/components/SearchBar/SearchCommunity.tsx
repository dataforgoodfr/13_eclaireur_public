'use client';

import SearchBar from '@/components/SearchBar/SearchBar';
import { useRouter } from 'next/navigation';

export default function SearchCommunity({ className }: { className?: string }) {
    const router = useRouter();

    function navigateToCommunityPage({ siren }: { siren: string }) {
        if (siren) {
            router.push(`/community/${siren}`);
        }
    }

    return <SearchBar className={className} placeholder='Rechercher...' onSelect={navigateToCommunityPage} />;
}
