'use client';

import { useRouter } from 'next/navigation';

import SearchBar from '#components/SearchBar/SearchBar';

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const router = useRouter();

  function navigateToCommunityPage({ siren }: { siren: string }) {
    if (siren) {
      onClose();
      router.push(`/community/${siren}`);
    }
  }

  return (
    <div className='space-y-4'>
      <h3 className='pt-12 text-center text-4xl text-primary'>Recherchez une collectivité</h3>
      <p className='text-center'>
        Accédez aux données de dépenses publiques de votre commune, département ou région.
      </p>
      <SearchBar
        className='relative mb-6'
        onSelect={navigateToCommunityPage}
        placeholder='Code postal, commune, département...'
      />{' '}
    </div>
  );
}
