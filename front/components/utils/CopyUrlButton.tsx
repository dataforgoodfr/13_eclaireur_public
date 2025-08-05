'use client';

import { Button, ButtonProps } from '#components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#components/ui/tooltip';
import { useToast } from '#hooks/use-toast';
import { Share } from 'lucide-react';

const DEFAULT_LABEL = 'Partager';

type CopyUrlButtonProps = {
  label?: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
};

export default function CopyUrlButton({ 
  label = DEFAULT_LABEL, 
  variant = 'outline',
  size = 'sm',
  className
}: CopyUrlButtonProps) {
  const { toast } = useToast();

  async function copyToClipboard() {
    await navigator.clipboard.writeText(location.href);
    toast({
      title: 'Url copiée dans le presse-papier',
    });
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} size={size} onClick={copyToClipboard} className={className}>
            {label ? <Share className="h-4 w-4 mr-2" /> : <Share className="h-4 w-4" />}
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copier dans le presse-papier l'url de la page</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
