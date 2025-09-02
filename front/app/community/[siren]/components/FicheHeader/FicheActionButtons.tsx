'use client';

import { useState } from 'react';

import type { Community } from '#app/models/community';
import { SimilarCommunity } from '#app/models/comparison';
import { ActionButton } from '#components/ui/action-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '#components/ui/dialog';
import { useToast } from '#hooks/use-toast';
import { Share } from 'lucide-react';

import { FicheComparisonInput } from './FicheComparisonInput';

type FicheActionButtonsProps = {
  community: Community;
  similarCommunityList: SimilarCommunity[];
  className?: string;
};

export function FicheActionButtons({
  community,
  similarCommunityList,
  className,
}: FicheActionButtonsProps) {
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    const url = `https://www.eclaireurpublic.fr/community/${community.siren}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        description: 'URL copiée dans le presse-papier',
      });
    } catch {
      toast({
        variant: 'destructive',
        description: "Erreur lors de la copie de l'URL",
      });
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Share button - Icon only */}
      <ActionButton variant='outline' onClick={handleShare} icon={<Share className='h-6 w-6' />} />

      {/* Compare button - Text only */}
      <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
        <DialogTrigger asChild>
          <ActionButton variant='default' text='Comparer' />
        </DialogTrigger>
        <DialogContent className='rounded-3xl sm:max-w-md [&>button]:left-4 [&>button]:right-auto [&>button]:flex [&>button]:h-12 [&>button]:w-12 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-bl-none [&>button]:rounded-br-lg [&>button]:rounded-tl-lg [&>button]:rounded-tr-none [&>button]:border [&>button]:border-primary [&>button]:bg-white [&>button]:text-primary [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground'>
          {/* Nécessaire d'ajouter un titre pour l'accessibilité de la modale */}
          <DialogTitle className='sr-only'>Sélectionner une collectivité à comparer</DialogTitle>
          <FicheComparisonInput community={community} similarCommunityList={similarCommunityList} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
