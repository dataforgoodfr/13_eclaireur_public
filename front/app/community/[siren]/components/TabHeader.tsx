'use client';

import { ReactNode } from 'react';

type TabHeaderProps = {
  title: string;
  titleSwitch?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/**
 * Reusable header component for Marchés Publics tabs
 */
export const TabHeader = ({ title, titleSwitch, actions, className = '' }: TabHeaderProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div className='flex-1'>
          <h3 className='mb-4'>{title}</h3>
          {titleSwitch}
        </div>
        {actions && <div className='flex items-center gap-2'>{actions}</div>}
      </div>
    </div>
  );
};
