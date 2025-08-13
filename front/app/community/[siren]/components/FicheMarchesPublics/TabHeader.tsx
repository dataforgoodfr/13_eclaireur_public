'use client';

import { ReactNode } from 'react';

type TabHeaderProps = {
  title: string;
  titleSwitch?: ReactNode; // Switch component that goes right after the title
  actions?: ReactNode; // Actions on the right (download, year selector, etc.)
  className?: string;
};

/**
 * Reusable header component for Marchés Publics tabs
 * Based on Evolution tab's superior design with larger title and proper responsive layout
 */
export const TabHeader = ({ 
  title, 
  titleSwitch,
  actions,
  className = ''
}: TabHeaderProps) => {
  return (
    <>
      {/* Desktop Layout */}
      <div className={`hidden md:flex items-start justify-between mb-6 ${className}`}>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-4'>
            <h2 className='text-2xl font-medium text-primary'>
              {title}
            </h2>
          </div>
          {titleSwitch}
        </div>
        {actions && (
          <div className='flex items-center gap-2 ml-4'>
            {actions}
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className={`md:hidden mb-6 ${className}`}>
        <div className='flex items-start justify-between mb-4'>
          <h2 className='text-xl font-medium text-primary leading-tight flex-1 pr-2'>
            {title}
          </h2>
          {actions && (
            <div className='flex items-center gap-2'>
              {actions}
            </div>
          )}
        </div>
        {titleSwitch}
      </div>
    </>
  );
};