'use client';

import { Community } from '@/app/models/community';
import CopyUrlButton from '@/components/utils/CopyUrlButton';

import GoBack from '../GoBack';
import { FicheComparisonInput } from './FicheComparisonInput';
import { useIsOpen } from './hooks/useIsOpen';

type FicheHeaderProps = {
  community: Community;
};

const descriptionText = `Visualiser les dernières données de dépenses publiques de votre collectivité locale`;

export function FicheHeader({ community }: FicheHeaderProps) {
  const isOpen = useIsOpen();
  const title = `${community.nom} ${community.code_postal ? community.code_postal : ''}`;

  if (!isOpen) return null;

  return (
    <div className='fixed z-40 flex h-[140px] w-full justify-between gap-6 bg-secondary p-4 md:flex-row'>
      <GoBack />
      <div className='flex flex-1 justify-center'>
        <div className='w-fit text-center'>
          <div className='grid min-w-0 grid-cols-3 gap-2'>
            <p className='col-span-2 text-xl font-bold'>{title}</p>
            <div>
              <CopyUrlButton label='Partager la fiche' />
            </div>
          </div>
          <p className='mt-6'>{descriptionText}</p>
        </div>
      </div>
      <FicheComparisonInput community={community} />
    </div>
  );
}
