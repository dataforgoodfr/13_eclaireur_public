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
    <Card className={`border border-black ${className}`}>
      {/* <Card className='border border-black'> */}
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
