'use client';

import { useState } from 'react';

import { ActionButton } from '#components/ui/action-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '#components/ui/dialog';
import { Search } from 'lucide-react';

import SearchModal from './SearchModal';

type SearchButtonProps = {
  className?: string;
};

export function SearchButton({ className }: SearchButtonProps) {
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <div className={`flex gap-2 ${className}`}>
      <Dialog open={isSearchModalOpen} onOpenChange={setSearchModalOpen}>
        <DialogTrigger asChild>
          <ActionButton variant='outline' icon={<Search className='h-6 w-6' />} />
        </DialogTrigger>
        <DialogContent className='rounded-3xl sm:max-w-md [&>button]:left-4 [&>button]:right-auto [&>button]:flex [&>button]:h-12 [&>button]:w-12 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-bl-none [&>button]:rounded-br-lg [&>button]:rounded-tl-lg [&>button]:rounded-tr-none [&>button]:border [&>button]:border-primary [&>button]:bg-white [&>button]:text-primary [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground'>
          <DialogTitle className='sr-only'>Rechercher une collectivité</DialogTitle>
          <SearchModal onClose={() => setSearchModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
