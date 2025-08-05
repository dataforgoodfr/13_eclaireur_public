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
import { Download } from 'lucide-react';

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
    <div 
      className='w-full p-6 lg:px-40 lg:pt-4 lg:pb-12 bg-cover bg-center bg-no-repeat relative'
      style={{
        backgroundImage: 'url(/collectivite-header.png)',
      }}
    >
      {/* Overlay transparent pour légère amélioration de lisibilité */}
      <div className='absolute inset-0 bg-white/10'></div>
      <div className='relative z-10 flex flex-col gap-6'>
        {/* Top bar with GoBack and Action buttons */}
        <div className='flex justify-between items-start'>
          <GoBack />
          
          {/* Action buttons - square rounded */}
          <div className='flex gap-3'>
            {/* Mobile: Share button */}
            <CopyUrlButton 
              label='' 
              variant="outline" 
              size="sm" 
              className='lg:hidden rounded-lg' 
            />
            
            {/* Export button - white square rounded */}
            <Button 
              variant="outline" 
              className='bg-white border-white text-primary hover:bg-white/90 rounded-lg'
              size="sm"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {/* Compare button - blue square rounded */}
            <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="default"
                  className='rounded-lg'
                  size="sm"
                >
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
        
        {/* Main content - centered */}
        <div className='text-center lg:text-left'>
          <h1 className='text-2xl lg:text-4xl font-bold text-primary mb-2'>{communityTitle}</h1>
          <h4 className='text-sm lg:text-lg text-muted-foreground mb-4 lg:mb-6'>
            <span>{communityType}</span>
            <span className='mx-1 lg:mx-2'>•</span>
            <span>Haute Savoie</span>
            {location && (
              <>
                <span className='mx-1 lg:mx-2'>•</span>
                <span>{location}</span>
              </>
            )}
          </h4>
          <p className='text-base text-primary lg:max-w-2xl'>{descriptionText}</p>
        </div>
      </div>
    </div>
  );
}
