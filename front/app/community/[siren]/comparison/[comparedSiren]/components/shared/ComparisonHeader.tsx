import Image from 'next/image';

import { FicheComparisonInput } from '#app/community/[siren]/components/FicheHeader/FicheComparisonInput';
import GoBack from '#app/community/[siren]/components/GoBack';
import type { Community } from '#app/models/community';

type ComparisonHeaderProps = {
  community1: Community;
  community2: Community;
  className?: string;
};

export function ComparisonHeader({ community1, community2, className }: ComparisonHeaderProps) {
  const title = `Comparaison entre ${community1.nom} et ${community2.nom}`;
  const description =
    'Comparer les dernières données de dépenses publiques de vos collectivités locales.';

  return (
    <div className={`relative w-full p-6 lg:px-40 lg:pb-12 lg:pt-4 ${className || ''}`}>
      {/* Background image réutilisée du FicheHeader */}
      <Image
        src='/collectivite-header.webp'
        alt='En-tête comparaison collectivités'
        fill
        className='-z-10 object-cover'
        priority
        fetchPriority='high'
        sizes='100vw'
        quality={85}
        placeholder='blur'
        blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
      />

      <div className='relative z-10 flex flex-col gap-6'>
        {/* Navigation back */}
        <div className='flex items-center justify-start'>
          <GoBack />
        </div>

        {/* Main content centré pour la comparaison */}
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-white lg:text-3xl'>{title}</h1>
          <p className='mt-4 text-lg text-white/90 lg:text-xl'>{description}</p>

          {/* Sélecteur de comparaison intégré */}
          <div className='mx-auto mt-6 w-full max-w-md'>
            <FicheComparisonInput community={community1} />
          </div>
        </div>
      </div>
    </div>
  );
}
