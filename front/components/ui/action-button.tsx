import { Button } from './button';
import { cn } from '#utils/utils';
import { ReactNode } from 'react';

type ActionButtonProps = {
  children?: ReactNode;
  icon?: ReactNode;
  text?: string;
  variant?: 'default' | 'outline';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export function ActionButton({
  children,
  icon,
  text,
  variant = 'default',
  onClick,
  className,
  disabled,
}: ActionButtonProps) {
  // Determine if it's icon-only (no text and no children, just icon)
  const isIconOnly = icon && !text && !children;

  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Base styling - consistent height for all buttons
        'rounded-tl-br h-12',
        // Icon-only: square button
        isIconOnly && 'w-12 p-0 flex items-center justify-center',
        // With text: standard horizontal padding, flex centering
        !isIconOnly && 'px-4 flex items-center justify-center',
        // Variant-specific styles
        variant === 'outline' &&
          'bg-white border-white text-primary hover:bg-white/90',
        className
      )}
    >
      {children ? (
        children
      ) : (
        <>
          {icon}
          {text && <span className={icon ? 'ml-2' : ''}>{text}</span>}
        </>
      )}
    </Button>
  );
}