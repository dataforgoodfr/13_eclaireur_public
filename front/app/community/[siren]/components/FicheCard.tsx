import { PropsWithChildren } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CopyUrlButton from '@/components/utils/CopyUrlButton';

type FicheCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  displayCopyUrl?: boolean;
}>;

export function FicheCard({ title, subtitle, displayCopyUrl = false, children }: FicheCardProps) {
  return (
    <Card className='mx-auto max-w-screen-2xl'>
      <CardHeader>
        <CardTitle className='text-center'>
          <span>{title}</span>
          {displayCopyUrl && <CopyUrlButton />}
        </CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
