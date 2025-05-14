import { PropsWithChildren } from 'react';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

type FicheCardProps = PropsWithChildren<{
  subtitle?: string;
}>;

export function FicheCard({ subtitle, children }: FicheCardProps) {
  return (
    <Card className='mx-auto max-w-screen-2xl'>
      <CardHeader>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
