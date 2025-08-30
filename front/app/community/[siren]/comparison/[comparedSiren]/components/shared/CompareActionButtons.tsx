'use client';

import type { Community } from '#app/models/community';
import { ActionButton } from '#components/ui/action-button';
import { useToast } from '#hooks/use-toast';
import { Share } from 'lucide-react';

type FicheActionButtonsProps = {
  community: Community;
  community2: Community;
  className?: string;
};

export function CompareActionButton({ community, community2, className }: FicheActionButtonsProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const url = `https://www.eclaireurpublic.fr/community/${community.siren}/comparison/${community2.siren}`;

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
    </div>
  );
}
