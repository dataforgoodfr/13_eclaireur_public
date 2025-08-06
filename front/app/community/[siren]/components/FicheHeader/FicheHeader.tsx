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
      className='w-full p-6 lg:px-40 lg:pt-4 lg:pb-12 bg-cover bg-center bg-no-repeat relative'
      style={{
        backgroundImage: 'url(/collectivite-header.png)',
      }}
    >
      <div className='absolute inset-0 bg-white/10'></div>
      <div className='relative z-10 flex flex-col gap-3 lg:gap-4'>
        {/* Top bar with GoBack and Action buttons - Mobile only */}
        <div className='flex justify-between items-center lg:hidden'>
          <GoBack />
          <FicheActionButtons community={community} />
        </div>

        {/* Desktop: GoBack seul avec espacement réduit */}
        <div className='hidden lg:block'>
          <GoBack />
        </div>

        {/* Main content avec boutons alignés sur desktop */}
        <div className='text-left lg:flex lg:items-start lg:justify-between'>
          <div className='lg:flex-1'>
            <h1 className='text-h1 lg:text-4xl font-bold text-primary mb-3 lg:mb-4'>{communityTitle}</h1>
            <h4 className='text-h4 lg:text-[28px] text-primary mb-3 lg:mb-4'>
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
          <FicheActionButtons community={community} className="hidden lg:flex lg:self-start" />
        </div>
      </div>
    </div>
  );
}