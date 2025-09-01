import { cn } from '#utils/utils';
import { type VariantProps, cva } from 'class-variance-authority';

const infoBlockVariants = cva('rounded p-3 space-y-2 transition-all duration-200', {
  variants: {
    color: {
      yellow: 'bg-yellow-100 hover:bg-yellow-50',
      lime: 'bg-lime-100 hover:bg-lime-50',
      indigo: 'bg-indigo-100 hover:bg-indigo-50',
      blue: 'bg-blue-100 hover:bg-blue-50',
      green: 'bg-green-100 hover:bg-green-50',
      gray: 'bg-gray-100 hover:bg-gray-50',
    },
    size: {
      sm: 'p-2 text-sm',
      md: 'p-3',
      lg: 'p-4 text-lg',
    },
  },
  defaultVariants: {
    color: 'gray',
    size: 'md',
  },
});

export interface InfoBlockProps extends VariantProps<typeof infoBlockVariants> {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
  valueClassName?: string;
}

export function InfoBlock({
  label,
  value,
  unit,
  color,
  size,
  className,
  valueClassName,
  ...props
}: InfoBlockProps) {
  return (
    <div className={cn(infoBlockVariants({ color, size }), className)} {...props}>
      <div className='text-sm font-medium text-gray-600'>{label}</div>
      <div className={cn('text-xl font-bold text-gray-900', valueClassName)}>
        {value} {unit && <span className='text-base font-normal text-gray-500'>{unit}</span>}
      </div>
    </div>
  );
}
