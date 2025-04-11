'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCopy } from 'lucide-react';

export default function CopyUrlButton() {
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
            Partager
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copier dans le presse-papier l'url de la page</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type ChiffreCleProps = {
  value: string;
  description: string;
};

function ChiffreCle({ value, description }: ChiffreCleProps) {
  return (
    <div className='h-48 w-64 content-center border px-6'>
      <p className='text-2xl font-bold'>{value}</p>
      <p className=''>{description}</p>
    </div>
  );
}
