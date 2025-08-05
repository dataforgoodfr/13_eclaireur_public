'use client';

import { useState } from 'react';

import { Community } from '#app/models/community';
import { Button } from '#components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#components/ui/dialog';
import { Download } from 'lucide-react';

import { FicheComparisonInput } from './FicheComparisonInput';

type FicheActionButtonsProps = {
  community: Community;
  className?: string;
};

export function FicheActionButtons({ community, className }: FicheActionButtonsProps) {
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Export button */}
      <Button
        variant="outline"
        className='bg-white border-white text-primary hover:bg-white/90 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none px-4 py-4'
      >
        <Download className="h-4 w-4" />
      </Button>

      {/* Compare button */}
      <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className='rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none px-4 py-4'
          >
            Comparer
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comparer avec une autre collectivité</DialogTitle>
          </DialogHeader>
          <FicheComparisonInput community={community} />
        </DialogContent>
      </Dialog>
    </div>
  );
}