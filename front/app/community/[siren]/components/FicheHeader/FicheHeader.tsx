'use client';

import { useState } from 'react';

import { Community } from '#app/models/community';
import { Button } from '#components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#components/ui/dialog';
import CopyUrlButton from '#components/utils/CopyUrlButton';
import { formatCommunityType } from '#utils/format';

import GoBack from '../GoBack';
import { FicheComparisonInput } from './FicheComparisonInput';

type FicheHeaderProps = {
  community: Community;
};

const descriptionText = `Visualiser les dernières données de dépenses publiques de votre collectivité locale`;

export function FicheHeader({ community }: FicheHeaderProps) {
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  
  const communityTitle = community.nom;
  const communityType = formatCommunityType(community.type);
  const location = community.code_postal ? `${community.code_postal}` : '';

  return (
    <div className='w-full bg-secondary p-6 lg:px-40 lg:pt-4 lg:pb-12'>
      <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>
        {/* GoBack button */}
        <div className='lg:self-start'>
          <GoBack />
        </div>
        
        {/* Main content - centered on mobile, left-aligned on desktop */}
        <div className='flex-1 text-center lg:text-left'>
          <h1 className='text-2xl lg:text-4xl font-bold text-primary mb-2'>{communityTitle}</h1>
          <div className='text-sm lg:text-lg text-muted-foreground mb-4 lg:mb-6'>
            <span>{communityType}</span>
            <span className='mx-1 lg:mx-2'>•</span>
            <span>Haute Savoie</span>
            {location && (
              <>
                <span className='mx-1 lg:mx-2'>•</span>
                <span>{location}</span>
              </>
            )}
          </div>
          <p className='text-sm lg:text-base text-muted-foreground lg:max-w-2xl'>{descriptionText}</p>
        </div>
        
        {/* Action buttons */}
        <div className='flex items-center justify-center lg:justify-end gap-3 lg:self-start'>
          {/* Mobile: Share button */}
          <CopyUrlButton label='' variant="outline" size="sm" className='lg:hidden' />
          
          {/* Main Compare button - blue, visible on all screens */}
          <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                Comparer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Comparer avec une autre collectivité</DialogTitle>
              </DialogHeader>
              <FicheComparisonInput community={community} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
