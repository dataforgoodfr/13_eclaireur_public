import type { ReactNode } from 'react';

import { Card } from '#components/ui/card';
import { cn } from '#utils/utils';

type SideBySideComparisonProps = {
  leftChild: ReactNode;
  rightChild: ReactNode;
  className?: string;
};

export function SideBySideComparison({
  leftChild,
  rightChild,
  className,
}: SideBySideComparisonProps) {
  return (
    <div className={cn('flex flex-col justify-between gap-8 md:flex-row', className)}>
      <Card className='flex-1 border-[1px] border-muted p-8'>{leftChild}</Card>

      <Card className='flex-1 border-[1px] border-muted p-8'>{rightChild}</Card>
    </div>
  );
}
