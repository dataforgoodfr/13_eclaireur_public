'use client';

import Image from 'next/image';

type SectionHeaderProps = {
  sectionTitle: string;
};

export function SectionHeader({ sectionTitle }: SectionHeaderProps) {
  return (
    <div className='relative flex h-[160px] w-full items-center p-20 lg:h-[305px]'>
      <Image
        src='/collectivite-header.jpg'
        alt='En-tête collectivité'
        fill
        className='-z-10 object-cover'
        priority
        fetchPriority='high'
        sizes='100vw'
      />
      <h1 className='relative z-10 text-center'>{sectionTitle}</h1>
    </div>
  );
}
