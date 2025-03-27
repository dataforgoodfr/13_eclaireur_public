import { PropsWithChildren } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type FicheCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function FicheCard({ title, subtitle, children }: FicheCardProps) {
  return (
    <Card className='mx-auto max-w-screen-2xl'>
      <CardHeader>
        <CardTitle className='text-center'>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
