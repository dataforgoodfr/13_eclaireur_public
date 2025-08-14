'use client';

import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ActionButton } from './action-button';

type InterpellerButtonProps = {
  siren: string;
  variant?: 'default' | 'outline';
  className?: string;
  showText?: boolean;
};

export function InterpellerButton({ 
  siren, 
  variant = 'default',
  className = '',
  showText = false
}: InterpellerButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/interpeller/${siren}/step1`);
  };

  return (
    <ActionButton
      onClick={handleClick}
      variant={variant}
      icon={<MessageSquare className="h-5 w-5" />}
      text={showText ? 'Interpeller' : undefined}
      className={className}
    />
  );
}