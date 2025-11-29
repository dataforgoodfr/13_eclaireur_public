'use client';

import Image from 'next/image';

import { Community } from '#app/models/community';
import { SimilarCommunity } from '#app/models/comparison';

import GoBack from '../GoBack';
import { FicheActionButtons } from './FicheActionButtons';

type FicheHeaderProps = {
  community: Community;
  similarCommunityList: SimilarCommunity[];
};

const descriptionText =
  'Visualiser les dernières données de dépenses publiques de votre collectivité locale';

export function FicheHeader({ community, similarCommunityList }: FicheHeaderProps) {
  const communityTitle = community.nom;
  const communityType = community.formattedType;
  const location = community.code_postal ? `${community.code_postal}` : '';
  const departementName = community.nom_departement;

  return (
    <div className='relative w-full p-6 lg:px-40 lg:pb-12 lg:pt-4'>
      {/* Background image with high priority */}
      <Image
        src='/collectivite-header.jpg'
        alt='En-tête collectivité'
        fill
        className='-z-10 object-cover'
        priority
        fetchPriority='high'
        sizes='100vw'
      />
      <div className='relative z-10 flex flex-col gap-6'>
        {/* Top bar with GoBack and Action buttons - Mobile only */}
        <div className='flex h-12 items-center justify-between lg:hidden'>
          <GoBack />
          <FicheActionButtons community={community} similarCommunityList={similarCommunityList} />
        </div>

        {/* Desktop: GoBack seul avec espacement réduit */}
        <div className='hidden lg:block'>
          <GoBack />
        </div>

        {/* Main content avec boutons alignés sur desktop */}
        <div className='text-left lg:flex lg:items-start lg:justify-between'>
          <div className='flex flex-col gap-4 lg:flex-1'>
            <h1>{communityTitle}</h1>
            <h4>
              <span>{communityType}</span>
              {departementName && (
                <>
                  <span className='mx-1 lg:mx-2'>•</span>
                  <span>{departementName}</span>
                </>
              )}
              {location && (
                <>
                  <span className='mx-1 lg:mx-2'>•</span>
                  <span>{location}</span>
                </>
              )}
            </h4>
            <p className='text-lg text-primary lg:max-w-2xl'>{descriptionText}</p>
          </div>

          {/* Action buttons desktop - alignés avec le titre */}
          <FicheActionButtons
            community={community}
            similarCommunityList={similarCommunityList}
            className='hidden lg:flex lg:self-start'
          />
        </div>
      </div>
    </div>
  );
}
