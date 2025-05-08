import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { cn } from '@/utils/utils';

type ErrorFetchingProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function ErrorFetching({ className, ...restProps }: ErrorFetchingProps) {
  return (
    <div
      className={cn('flex h-[100%] w-[100%] items-center justify-center', className)}
      {...restProps}
    >
      <div>Erreur lors du chargement des données.</div>
    </div>
  );
}
