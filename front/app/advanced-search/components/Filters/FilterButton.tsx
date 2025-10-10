'use client';

import { useState } from 'react';

import { ActionButton } from '#components/ui/action-button';
import { Button } from '#components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '#components/ui/dialog';
import { ListFilter } from 'lucide-react';

import FilterModal from './FilterModal';

type FilterButtonProps = {
  className?: string;
};

export function FilterButton({ className }: FilterButtonProps) {
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  function closeModal() {
    setFilterModalOpen(false);
  }

  const [clearAllFiltersSignal, setClearAllFiltersSignal] = useState(0);

  return (
    <div className={`flex gap-2 ${className}`}>
      <Dialog open={isFilterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogTrigger asChild>
          <ActionButton variant='outline' icon={<ListFilter className='h-6 w-6' />} />
        </DialogTrigger>
        <DialogContent className='w-[95%] rounded-3xl sm:max-w-md [&>button]:left-4 [&>button]:right-auto [&>button]:flex [&>button]:h-12 [&>button]:w-12 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-bl-none [&>button]:rounded-br-lg [&>button]:rounded-tl-lg [&>button]:rounded-tr-none [&>button]:border [&>button]:border-primary [&>button]:bg-white [&>button]:text-primary [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground'>
          <DialogTitle className='text-center'>
            <div className='flex w-full'>
              <h3 className='absolute left-1/2 -translate-x-1/2'>Filtres</h3>
              <Button
                variant='link'
                size='sm'
                className='ml-auto text-base font-medium text-danger'
                onClick={() => setClearAllFiltersSignal((prev) => prev + 1)} //increment to signal a reset
              >
                Effacer tout
              </Button>
            </div>
          </DialogTitle>
          <FilterModal closeModal={closeModal} clearAllFiltersSignal={clearAllFiltersSignal} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
