import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { cn } from '@/utils/utils';

type LoadingProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export default function Loading({ className, ...restProps }: LoadingProps) {
  return (
    <div
      className={cn('flex h-[100%] w-[100%] items-center justify-center', className)}
      {...restProps}
    >
      <div>Chargement...</div>
    </div>
  );
}
