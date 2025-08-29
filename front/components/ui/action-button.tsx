import { ReactNode } from 'react';

import { cn } from '#utils/utils';

import { Button } from './button';

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
        // Base styling - consistent height for all buttons with custom rounded corners
        'h-12 rounded-bl-none rounded-br-lg rounded-tl-lg rounded-tr-none',
        // Icon-only: 56x48 button
        isIconOnly && 'flex h-12 w-14 items-center justify-center p-0',
        // With text: standard horizontal padding, flex centering
        !isIconOnly && 'flex items-center justify-center px-4',
        // Variant-specific styles
        variant === 'outline' && 'border-gray-300 bg-white text-primary hover:bg-gray-50',
        variant === 'default' && 'bg-primary hover:bg-primary/90',
        className,
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
