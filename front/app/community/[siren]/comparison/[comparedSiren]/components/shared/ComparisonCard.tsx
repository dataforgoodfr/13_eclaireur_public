import type { ReactNode } from 'react';

import { cn } from '#utils/utils';
import { type VariantProps, cva } from 'class-variance-authority';

const cardVariants = cva('rounded p-4 space-y-4 transition-all duration-200', {
  variants: {
    variant: {
      default: 'bg-gray-100 hover:bg-gray-50',
      primary: 'bg-blue-50 hover:bg-blue-25 border border-blue-200',
      secondary: 'bg-green-50 hover:bg-green-25 border border-green-200',
    },
    size: {
      sm: 'w-48 p-3',
      md: 'w-64 p-4',
      lg: 'w-80 p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface ComparisonCardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
  title?: string;
  communityName?: string;
}

export function ComparisonCard({
  children,
  className,
  variant,
  size,
  title,
  communityName,
  ...props
}: ComparisonCardProps) {
  return (
    <div className={cn(cardVariants({ variant, size }), className)} {...props}>
      {title && (
        <div className='mb-3'>
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          {communityName && <p className='text-sm text-gray-600'>{communityName}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
