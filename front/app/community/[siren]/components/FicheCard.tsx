import { PropsWithChildren } from 'react';

import { Card, CardContent, CardDescription, CardHeader } from '#components/ui/card';

type FicheCardProps = PropsWithChildren<{
  subtitle?: string;
}>;

export function FicheCard({ subtitle, children }: FicheCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
