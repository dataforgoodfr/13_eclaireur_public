'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCopy } from 'lucide-react';

const DEFAULT_LABEL = 'Partager';

type CopyUrlButtonProps = {
  label?: string;
};

export default function CopyUrlButton({ label = DEFAULT_LABEL }: CopyUrlButtonProps) {
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
          <Button variant='outline' size='sm' onClick={copyToClipboard} className='ms-3'>
            <ClipboardCopy />
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
