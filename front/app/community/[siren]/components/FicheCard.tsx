'use client';

import { PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCopy } from 'lucide-react';

type FicheCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  displayCopyUrl?: boolean;
}>;

export function FicheCard({ title, subtitle, displayCopyUrl = false, children }: FicheCardProps) {
  const { toast } = useToast();

  async function copyToClipboard() {
    await navigator.clipboard.writeText(location.href);
    toast({
      title: 'Url copiée dans le presse-papier',
    });
  }

  return (
    <Card className='mx-auto max-w-screen-2xl'>
      <CardHeader>
        <CardTitle className='text-center'>
          <span>{title}</span>
          {displayCopyUrl && (
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
          )}
        </CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
