import type { PropsWithChildren, ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader } from '#components/ui/card';

type FicheCardProps = PropsWithChildren<{
  title?: ReactNode;
  subtitle?: string;
  header?: ReactNode;
}>;

export function FicheCard({ title, subtitle, header, children }: FicheCardProps) {
  return (
    <Card className="border border-muted-DEFAULT shadow-none">

      <CardHeader>
        {header || (
          <>
            {title}
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
