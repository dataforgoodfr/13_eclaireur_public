'use client';

import { useState } from 'react';

import { Community } from '#app/models/community';
import { ActionButton } from '#components/ui/action-button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '#components/ui/dialog';
import { useToast } from '#hooks/use-toast';
import { Share } from 'lucide-react';

import { FicheComparisonInput } from './FicheComparisonInput';

type FicheActionButtonsProps = {
  community: Community;
  className?: string;
};

export function FicheActionButtons({ community, className }: FicheActionButtonsProps) {
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    const url = `https://www.eclaireurpublic.fr/community/${community.siren}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        description: "URL copiée dans le presse-papier",
      });
    } catch {
      toast({
        variant: "destructive",
        description: "Erreur lors de la copie de l'URL",
      });
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Share button - Icon only */}
      <ActionButton
        variant="outline"
        onClick={handleShare}
        icon={<Share className="h-6 w-6" />}
      />

      {/* Compare button - Text only */}
      <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
        <DialogTrigger asChild>
          <ActionButton
            variant="default"
            text="Comparer"
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-md rounded-3xl [&>button]:right-auto [&>button]:left-4 [&>button]:h-12 [&>button]:w-12 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:bg-white [&>button]:rounded-tl-lg [&>button]:rounded-br-lg [&>button]:rounded-tr-none [&>button]:rounded-bl-none [&>button]:border [&>button]:border-primary [&>button]:text-primary [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground">
          <FicheComparisonInput community={community} />
        </DialogContent>
      </Dialog>
    </div>
  );
}