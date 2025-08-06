'use client';

import { Community } from '#app/models/community';
import { formatCommunityType } from '#utils/format';

import GoBack from '../GoBack';
import { FicheActionButtons } from './FicheActionButtons';

type FicheHeaderProps = {
  community: Community;
};

const descriptionText = `Visualiser les dernières données de dépenses publiques de votre collectivité locale`;

export function FicheHeader({ community }: FicheHeaderProps) {
  const communityTitle = community.nom;
  const communityType = formatCommunityType(community.type);
  const location = community.code_postal ? `${community.code_postal}` : '';
  const departementName = community.nom_departement;

  return (
    <div
      className='relative w-full bg-cover bg-center bg-no-repeat p-6 lg:px-40 lg:pb-12 lg:pt-4'
      style={{
        backgroundImage: 'url(/collectivite-header.png)',
      }}
    >
      <div className='relative z-10 flex flex-col gap-6 lg:gap-4'>
        {/* Top bar with GoBack and Action buttons - Mobile only */}
        <div className='flex items-center justify-between lg:hidden h-12'>
          <GoBack />
          <FicheActionButtons community={community} />
        </div>

        {/* Desktop: GoBack seul avec espacement réduit */}
        <div className='hidden lg:block'>
          <GoBack />
        </div>

        {/* Main content avec boutons alignés sur desktop */}
        <div className='text-left lg:flex lg:items-start lg:justify-between'>
          <div className='flex flex-col gap-3 lg:flex-1'>
            <h1 className='lg:mb-4'>{communityTitle}</h1>
            <h4 className='lg:mb-4'>
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
          <FicheActionButtons community={community} className='hidden lg:flex lg:self-start' />
        </div>
      </div>
    </div>
  );
}
