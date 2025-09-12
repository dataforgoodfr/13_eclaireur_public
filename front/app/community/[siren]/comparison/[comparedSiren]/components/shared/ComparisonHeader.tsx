import Image from 'next/image';

import GoBack from '#app/community/[siren]/components/GoBack';
import type { Community } from '#app/models/community';
import { Button } from '#components/ui/button';
import { Share2 } from 'lucide-react';

import { CompareActionButton } from './CompareActionButtons';

type ComparisonHeaderProps = {
  community1: Community;
  community2: Community;
  className?: string;
};

export function ComparisonHeader({ community1, community2, className }: ComparisonHeaderProps) {
  return (
    <div className={`relative w-full p-6 lg:px-40 lg:pb-12 lg:pt-4 ${className || ''}`}>
      <Image
        src='/collectivite-header.webp'
        alt='En-tête comparaison collectivités'
        fill
        className='-z-10 object-cover'
        priority
        fetchPriority='high'
        sizes='100vw'
      />

      <div className='relative z-10 flex flex-col gap-6'>
        {/* Top bar - Mobile only */}
        <div className='flex h-12 items-center justify-between lg:hidden'>
          <GoBack siren={community1.siren} />
          <Button variant='ghost' size='sm' className='text-white hover:text-gray-200'>
            <Share2 size={20} />
          </Button>
        </div>

        {/* Desktop: GoBack seul avec espacement réduit */}
        <div className='hidden h-12 lg:block'>
          <GoBack siren={community1.siren} />
        </div>

        {/* Main content aligné à gauche comme FicheHeader */}
        <div className='text-left lg:flex lg:items-start lg:justify-between'>
          <div className='text-md flex flex-col gap-4 font-bold text-primary lg:flex-1'>
            <h1 className='text-primary'>Comparaison entre</h1>
            {/* Community badges */}
            <div className='flex flex-wrap gap-3'>
              <div className='rounded-full bg-brand-2 px-4 py-2'>{community1.nom}</div>
              <span className='font-kanit-bold text-4xl leading-none'>et</span>
              <div className='rounded-full bg-primary-light px-4 py-2'>{community2.nom}</div>
            </div>
          </div>

          {/* Action buttons desktop - alignés avec le titre */}
          <CompareActionButton
            community={community1}
            community2={community2}
            className='hidden lg:flex'
          />
        </div>
      </div>
    </div>
  );
}
