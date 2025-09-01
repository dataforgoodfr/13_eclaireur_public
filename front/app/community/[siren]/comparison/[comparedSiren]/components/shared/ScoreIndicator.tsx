import { cn } from '#utils/utils';
import { type VariantProps, cva } from 'class-variance-authority';

const scoreVariants = cva(
  'inline-flex h-8 w-8 items-center justify-center rounded text-sm font-semibold text-white',
  {
    variants: {
      score: {
        A: 'bg-green-500',
        B: 'bg-green-400',
        C: 'bg-yellow-500',
        D: 'bg-orange-500',
        E: 'bg-red-500',
        unavailable: 'bg-gray-400',
      },
    },
    defaultVariants: {
      score: 'unavailable',
    },
  },
);

export interface ScoreIndicatorProps extends VariantProps<typeof scoreVariants> {
  score: 'A' | 'B' | 'C' | 'D' | 'E' | 'unavailable';
  className?: string;
  label?: string;
}

export function ScoreIndicator({ score, className, label, ...props }: ScoreIndicatorProps) {
  return (
    <div
      className={cn(scoreVariants({ score }), className)}
      role='img'
      aria-label={label ? `Score ${score}: ${label}` : `Score ${score}`}
      {...props}
    >
      {score === 'unavailable' ? '?' : score}
    </div>
  );
}
