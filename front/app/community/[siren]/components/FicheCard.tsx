import type { PropsWithChildren, ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader } from '#components/ui/card';

type FicheCardProps = PropsWithChildren<{
  title?: ReactNode;
  subtitle?: string;
  header?: ReactNode;
  className?: string;
}>;

export function FicheCard({ title, subtitle, header, children, className }: FicheCardProps) {
  return (
    <Card
      className={`border-muted-DEFAULT rounded-3xl border bg-card p-4 text-card-foreground shadow-none md:p-8 ${className}`}
    >
      <CardHeader className='p-0 pb-8'>
        {header || (
          <>
            {title}
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </>
        )}
      </CardHeader>
      <CardContent className='p-0'>{children}</CardContent>
    </Card>
  );
}
