import type { ReactNode } from 'react';

import { Card } from '#components/ui/card';
import { cn } from '#utils/utils';

type SideBySideComparisonProps = {
  leftChild: ReactNode;
  rightChild: ReactNode;
  className?: string;
  leftNoPadding?: boolean;
  rightNoPadding?: boolean;
};

export function SideBySideComparison({
  leftChild,
  rightChild,
  className,
}: SideBySideComparisonProps) {
  return (
    <div className={cn('flex flex-col justify-between gap-8 md:flex-row', className)}>
      <Card className="flex h-full flex-1 flex-col rounded-2xl border-[1px] border-muted p-8 has-[img[alt='Erreur']]:p-0">
        {leftChild}
      </Card>
      <Card className="flex h-full flex-1 flex-col rounded-2xl border-[1px] border-muted p-8 has-[img[alt='Erreur']]:p-0">
        {rightChild}
      </Card>
    </div>
  );
}
