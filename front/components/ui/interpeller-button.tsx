'use client';

import Image from 'next/image';
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
      icon={
        <Image
          src="/eclaireur/interpeller.svg"
          alt="Interpeller"
          width={20}
          height={20}
        />
      }
      text={showText ? 'Interpeller' : undefined}
      className={className}
    />
  );
}