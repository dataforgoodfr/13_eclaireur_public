'use client';

import { ActionButton } from '#components/ui/action-button';
import { useToast } from '#hooks/use-toast';
import { Copy } from 'lucide-react';

type CopyPasteButtonsProps = {
  className?: string;
};

export function CopyPasteButtons({ className }: CopyPasteButtonsProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const url = `https://www.eclaireurpublic.fr`;
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
    <div className={`h-[56px] ${className}`}>
      {/* Share button - Icon only */}
      <ActionButton
        variant='action'
        className='h-[56px]'
        onClick={handleShare}
        icon={<Copy className='bg-foreground font-bold text-white' strokeWidth={2} />}
      />
    </div>
  );
}
